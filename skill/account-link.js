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

    return line_client.replyMessage(event.replyToken, [{
        type: "sticker",
        packageId: "2",
        stickerId: "144"
    },{
        type: "text",
        text: `リンク完了です。ここでnonce: ${event.link.nonce} をキーにして保存してあったCPのUser Id: ${memory.get(event.link.nonce).cp_user_id} を取り出し、LINEのUser Id: ${event.source.userId} と紐づけてデータベースに保存します。`
    }])
}
