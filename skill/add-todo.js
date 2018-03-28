"use strict";

const debug = require("debug")("skill");
const todoist = require("../service/todoist");
const db = require("../service/db");

module.exports = (line_client, event) => {
    let linkage = db.get(`linkage_${event.source.userId}`);
    if (!linkage.access_token){
        return line_client.replyMessage(event.replyToken, {
            type: "text",
            text: "まだtodoistと連携されていないようです。"
        })
    }

    let task = event.message.text.replace(/todo /i, "").trim();
    return todoist.add_task(linkage.access_token, task).then((response) => {
        return line_client.replyMessage(event.replyToken, {
            type: "text",
            text: "タスクを追加しました。"
        });
    })
}
