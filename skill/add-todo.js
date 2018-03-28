"use strict";

const debug = require("debug")("skill");
const todoist = require("../service/todoist");
const memory = require("memory-cache");

module.exports = (line_client, event) => {
    let access_token = memory.get(event.source.userId).access_token;

    if (!access_token){
        return line_client.replyMessage(event.replyToken, {
            type: "text",
            text: "まだtodoistと連携されていないようです。"
        })
    }

    let task = event.message.text.replace("todo ", "").trim();
    return todoist.add_task(access_token, task).then((response) => {
        return line_client.replyMessage(event.replyToken, {
            type: "text",
            text: "タスクを追加しました。"
        });
    })
}
