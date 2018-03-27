"use strict";

const debug = require("debug")("skill");
const memory = require("memory-cache");

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
    let ext_access_token = memory.get(event.link.nonce).ext_access_token;
    if (!ext_access_token){
        throw new Error("ext_access_token not found.");
    }

    // Save the linkage of creadential of the external service and LINE user id.
    save_linkage(event.source.userId, {
        access_token: ext_access_token
    })

    // Reply to user to notify link has been completed.
    return line_client.replyMessage(event.replyToken, [{
        type: "sticker",
        packageId: "2",
        stickerId: "144"
    },{
        type: "text",
        text: `リンク完了です。`
    }])

    function save_linkage(line_user_id, ext_credential){
        memory.put(line_user_id, ext_credential);
    }
}
