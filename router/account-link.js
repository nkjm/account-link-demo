"use strict";

const router = require("express").Router();
const crypto = require("crypto");
const debug = require("debug")("router");
const memory = require("memory-cache");
const session = require("express-session");
const secure_compare = require("secure-compare");
const ext_service = require("../service/todoist.js");
const session_options = {
    secret: process.env.LINE_CHANNEL_SECRET,
    resave: false,
    saveUninitialized: false
}
router.use(session(session_options));

// Route to initiate authentication of external service.
router.get("/", (req, res) => {
    // Check required parameter.
    if (!req.query.link_token){
        debug(`Required parameter "link_token" not set.`);
        res.sendStatus(400);
    }

    // Save link token and state to session.
    req.session.link_token = req.query.link_token;
    req.session.state = _random();

    // Get authentication URL of the external service.
    let auth_url = ext_service.get_auth_url(req.session.state);

    // Redirect to authentication URL.
    res.redirect(auth_url);
});

// Route to be redirected after authentication of external service.
router.get("/callback", (req, res) => {
    if (!req.session.link_token){
        debug(`Required session parameter link_token not set.`);
        res.sendStatus(400);
    }
    if (!req.query.code || !req.query.state){
        debug(`Required query strings not set.`);
        res.sendStatus(400);
    }
    if (!secure_compare(req.query.state, req.session.state)){
        debug(`state does not match.`);
        res.sendStatus(400);
    }

    // Retrieve user id or access token of the external service. In this case, we retrieve access token.
    ext_service.get_token(req.query.code).then((response) => {
        if (!response.access_token){
            debug(`Access token not found.`);
            res.sendStatus(400);
        }

        // Create nonce.
        let nonce = _random();

        // Save access_token to database.
        // In this case, we use memory-cache as database and set 5 min as lifetime.
        memory.put(nonce, {
            ext_access_token: response.access_token
        }, 300 * 1000);

        // Redirect to LINE server to ensure the LINE user id is not spoofed.
        let line_dialog_hostname = process.env.LINE_DIALOG_HOSTNAME || "access.line.me";
        let redirect_url = `https://${line_dialog_hostname}/dialog/bot/accountLink?nonce=${nonce}&linkToken=${req.session.link_token}`;
        res.redirect(redirect_url);
    })
})

/**
Method to generate random string.
@method
@return {Number}
*/
function _random(){
    return crypto.randomBytes(20).toString('hex');
}

module.exports = router;
