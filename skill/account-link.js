"use strict";

const debug = require("debug")("skill");
const memory = require("memory-cache");

module.exports = (line_client, event) => {
    debug(`Got accountLink event.`);
    debug(event);

    if (event.link.result !== "ok"){
        // Account link failed.
        return line_client.replyMessage(event.replyToken, {
            type: "text",
            text: "リンクに失敗しました。"
        });
    }

    // Update user db.
    let user_db = memory.get("user_db");
    if (!user_db) user_db = {};
    user_db[event.source.userId] = memory.get(event.link.nonce).ext_access_token;
    debug(user_db);
    memory.put("user_db", user_db);

    return line_client.replyMessage(event.replyToken, [{
        type: "sticker",
        packageId: "2",
        stickerId: "144"
    },{
        type: "text",
        text: `リンク完了です。`
    }])
}
