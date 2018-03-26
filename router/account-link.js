"use strict";

const router = require("express").Router();
const crypto = require("crypto");
const memory = require("memory-cache");
const session = require("express-session");
const user_db = require("../service/user-db.js");
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

    // Redirect to CP authentication to get user id in CP.
    let redirect_url = user_db.get_auth_url();
    res.redirect(redirect_url);
});

router.get("/callback", (res, req) => {
    if (!req.session.link_token){
        debug(`Required session parameter link_token not set.`);
        res.sendStatus(400);
    }
    if (!req.query.cp_user_id){
        debug(`Required parameter cp_user_id not set.`);
        res.sendStatus(400);
    }

    // Retrieve user id.
    let cp_user_id = req.query.cp_user_id; //TBD

    // Create nonce.
    let nonce = _random();

    // Save cp user id to database.
    // In this case, we use memory-cache as database and set 5 min as lifetime.
    memory.put(nonce, {
        cp_user_id: cp_user_id
    }, 300 * 1000);

    // Redirect to LINE server.
    let redirect_url = `https://${process.env.LINE_DIALOG_HOSTNAME}/dialog/bot/account/link?nonce=${nonce}&link_token=${link_token}`;
    res.redirect(redirect_url);
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
