"use strict";

require("dotenv").config();

const debug = require("debug")("skill");
const crypto = require("crypto");
const memory = require("memory-cache");
const request = require("request");
Promise.promisifyAll(request);

module.exports = (line_client, event) => {
    // Get link link_token
    return get_link_token(event.source.userId).then((link_token) => {
        let message = {
            type: "template",
            altText: "TodoistとLINEを連携するには下記ボタンをタップして認証を開始してください。",
            template: {
                type: "buttons",
                text: "TodoistとLINEを連携するには下記ボタンをタップして認証を開始してください。",
                actions: [
                    {type:"uri", label:"連携", uri:`https://${process.env.EXT_HOSTNAME}/account-link?link_token=${link_token}`}
                ]
            }
        }
        return line_client.replyMessage(event.replyToken, message);
    })

    function get_link_token(user_id){
        let headers = {
            Authorization: "Bearer " + process.env.LINE_ACCESS_TOKEN
        }
        let url = `https://${process.env.LINE_API_HOSTNAME}/v2/bot/user/${user_id}/linkToken`;

        return request.postAsync({
            url: url,
            headers: headers,
            json: true
        }).then((response) => {
            if (response.statusCode !== 200){
                return Promise.reject(new Error(response.statusMessage));
            }
            return response.body.linkToken;
        })
    }

    /**
    Method to generate random string.
    @method
    @return {Number}
    */
    function _random(){
        return crypto.randomBytes(20).toString('hex');
    }
}
