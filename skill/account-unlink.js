"use strict";

const debug = require("debug")("todoist-bot:skill");
const db = require("../service/db");
const ext_service = require("../service/todoist");

module.exports = (line_client, event) => {
    let ext_credential = db.get(`linkage_${event.source.userId}`);

    if (!ext_credential){
        debug("Credential not found.");
        return;
    }

    // Delete linkage from database.
    db.del(`linkage_${event.source.userId}`);
    debug(`linkaged has been deleted from database.`);

    // Revoke access token on behalf of the user.
    return ext_service.revoke_token(ext_credential.access_token).then((response) => {
        debug(`access token has been revoked.`);
        if (event.replyToken){
            // Reply to user to notify unlink has been completed.
            return line_client.replyMessage(event.replyToken, {
                type: "text",
                text: "リンクが解除されました。"
            });
        }
    })
}
