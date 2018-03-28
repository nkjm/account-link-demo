"use strict";

const debug = require("debug")("skill");
const crypto = require("crypto");
const request = require("request");
Promise.promisifyAll(request);

module.exports = (line_client, event) => {
    // Get link token and provide link button to user.
    return get_link_token(event.source.userId).then((link_token) => {
        let ext_hostname = process.env.EXT_HOSTNAME || `${process.env.HEROKU_APP_NAME}.herokuapp.com`;
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

    /**
    Method to issue link token from LINE server
    @param {String} user_id LINE user id
    @return {String} link token
    */
    function get_link_token(user_id){
        let headers = {
            Authorization: "Bearer " + process.env.LINE_ACCESS_TOKEN
        }
        let line_api_hostname = process.env.LINE_API_HOSTNAME || "api.line.me";
        let url = `https://${line_api_hostname}/v2/bot/user/${user_id}/linkToken`;

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
