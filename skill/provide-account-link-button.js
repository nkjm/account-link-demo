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

        // Save cp user id to database.
        // In this case, we use memory-cache as database and set 5 min as lifetime.
        let nonce = _random();
        memory.put(nonce, {
            cp_user_id: "TEST_CP_USER_ID"
        }, 300 * 1000);

        let message = {
            type: "template",
            altText: "下記ボタンからXXXのアカウント連携をおこなってください",
            template: {
                type: "buttons",
                text: "下記ボタンからXXXのアカウント連携をおこなってください",
                actions: [
                    {type:"uri", label:"連携", uri:`https://${process.env.CP_HOSTNAME}/account-link?link_token=${link_token}`},
                    {type:"uri", label:"test", uri:`https://${process.env.LINE_DIALOG_HOSTNAME}/dialog/bot/accountLink?nonce=${nonce}&linkToken=${link_token}`}
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
