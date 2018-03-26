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

router.get("/", (req, res) => {
    // Check required parameter.
    if (!req.query.link_token){
        debug(`Required parameter "link_token" not set.`);
        res.sendStatus(400);
    }

    // Save link token to session.
    req.session.link_token = req.query.link_token;

    // Redirect to authentication URL to get external User Id/Token.
    let state = _random();
    req.session.state = state;

    let redirect_url = ext_service.get_auth_url(state);
    debug(redirect_url);
    res.redirect(redirect_url);
});

router.get("/callback", (req, res) => {
    if (!req.session.link_token){
        debug(`Required session parameter link_token not set.`);
        res.sendStatus(400);
    }
    if (!req.query.code){
        debug(`Required parameter code not set.`);
        res.sendStatus(400);
    }
    if (!req.query.state){
        debug(`Required parameter state not set.`);
        res.sendStatus(400);
    }
    if (!secure_compare(req.query.state, req.session.state)){
        debug(`state does not match.`);
        res.sendStatus(400);
    }

    ext_service.get_token(req.query.code).then((response) => {
        // Create nonce.
        let nonce = _random();

        let ext_acess_token = response.access_token;

        // Save access_token to database.
        // In this case, we use memory-cache as database and set 5 min as lifetime.
        memory.put(nonce, {
            ext_access_token: ext_access_token
        }, 300 * 1000);

        // Redirect to LINE server.
        let redirect_url = `https://${process.env.LINE_DIALOG_HOSTNAME}/dialog/bot/accountLink?nonce=${nonce}&linkToken=${req.session.link_token}`;
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
