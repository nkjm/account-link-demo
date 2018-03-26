"use strict";

const debug = require("debug")("skill");
const todoist = require("../service/todoist");
const memory = require("memory-cache");

module.exports = (line_client, event) => {
    let token = memory.get("user_db")[event.source.userId];
    if (!token){
        return line_client.replyMessage(event.replyToken, {
            type: "text",
            text: "まだtodoistと連携されていないようです。"
        })
    }

    let task = event.message.text.replace("todo:").trim();
    return todoist.add_task(token, task).then((response) => {
        return line_client.replyMessage(event.replyMessage, {
            type: "text",
            text: "タスクを追加しました。"
        });
    })
}
