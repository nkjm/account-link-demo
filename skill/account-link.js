"use strict";

const debug = require("debug")("todoist-bot:skill");
const db = require("../service/db");

module.exports = (line_client, event) => {
    if (event.link.result !== "ok"){
        // Account link failed.
        debug("Link failed.");
        return line_client.replyMessage(event.replyToken, {
            type: "text",
            text: "リンクに失敗しました。"
        });
    }

    // Check required parameter in the event.
    if (!event.source.userId || !event.link || !event.link.nonce){
        throw new Error("userId or nonce not found.");
    }

    // Retrieve access token of external service.
    let ext_access_token = db.get(`nonce_${event.link.nonce}`).ext_access_token;
    if (!ext_access_token){
        throw new Error("ext_access_token not found.");
    }

    // Save the linkage of creadential of the external service and LINE user id.
    db.put(`linkage_${event.source.userId}`, {
        access_token: ext_access_token
    })

    // Reply to user to notify link has been completed.
    return line_client.replyMessage(event.replyToken, [{
        type: "sticker",
        packageId: "2",
        stickerId: "144"
    },{
        type: "text",
        text: `リンク完了です。このアカウントをブロックするとリンクも自動的に解除されます。`
    }])
}
