"use strict";

const debug = require("debug")("skill");
const memory = require("memory-cache");
const user_db = require("../service/user-db");

module.exports = (line_client, event) => {
    debug(`Got accountLink event.`);
    debug(event);

    /*
    // Retrieve cp user id.
    let cp_user_id = memory.get(event.accountLink.nonce).cp_user_id;

    // Save mapping of cp user id and line user id.
    return user_db.save({
        user_id: cp_user_id,
        line_user_id: line_user_id
    }).then((response) => {
        return line_client.replyMessage(event.replyToken, {
            type: "text",
            text: "アカウントがリンクされました"
        })
    })
    */
}
