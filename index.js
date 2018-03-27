"use strict";

require("dotenv").config();

// Import packages.
Promise = require("bluebird");
const server = require("express")();
const line = require("@line/bot-sdk");
const line_options = {
    channelSecret: process.env.LINE_CHANNEL_SECRET,
    channelAccessToken: process.env.LINE_ACCESS_TOKEN
}
const line_client = new line.Client(line_options);
const line_middleware = line.middleware(line_options);
const skill_provide_account_link_button = require("./skill/provide-account-link-button");
const skill_account_link = require("./skill/account-link");
const skill_add_todo = require("./skill/add-todo");

// Launch server.
server.listen(process.env.PORT || 5001, () => {
    console.log("server is running...");
})

// Router configuration for account link.
const route_account_link = require("./router/account-link");
server.use("/account-link", route_account_link);

// Router configuration for messaging api webhook.
server.post("/webhook", line_middleware, (req, res) => {
    res.sendStatus(200);

    req.body.events.forEach((event) => {
        if (event.type === "follow"){
            skill_provide_account_link_button(line_client, event);
        } else if (event.type === "accountLink"){
            skill_account_link(line_client, event);
        } else if (event.type === "message"){
            if (event.message.type === "text"){
                if (event.message.text.toLowerCase() === "link"){
                    // for test purpose
                    skill_provide_account_link_button(line_client, event);
                } else if (event.message.text.match(/^todo:/)){
                    skill_add_todo(line_client, event);
                }
            }
        }
    })
})

module.exports = server;
