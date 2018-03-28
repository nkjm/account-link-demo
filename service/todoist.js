"use strict";

const debug = require("debug")("todoist-bot:service");
const request = require("request");
Promise.promisifyAll(request);

module.exports = class ServiceTodoist {
    static get_auth_url(state){
        let client_id = encodeURIComponent(process.env.TODOIST_CLIENT_ID);
        let scope = "data:read_write";
        let url = `https://todoist.com/oauth/authorize?client_id=${client_id}&scope=${scope}&state=${state}`;

        return url;
    }

    static get_token(code){
        let url = `https://todoist.com/oauth/access_token`;
        let body = {
            client_id: encodeURIComponent(process.env.TODOIST_CLIENT_ID),
            client_secret: encodeURIComponent(process.env.TODOIST_CLIENT_SECRET),
            redirect_uri: encodeURIComponent(process.env.TODOIST_REDIRECT_URI),
            code: code
        }

        return request.postAsync({
            url: url,
            body: body,
            json: true
        }).then((response) => {
            debug(response.body);
            return response.body;
        })
    }

    static revoke_token(token){
        let url = "https://todoist.com/api/access_tokens/revoke";
        let body = {
            client_id: encodeURIComponent(process.env.TODOIST_CLIENT_ID),
            client_secret: encodeURIComponent(process.env.TODOIST_CLIENT_SECRET),
            access_token: token
        }

        return request.postAsync({
            url: url,
            body: body,
            json: true
        }).then((response) => {
            debug(response.body);
            return response.body;
        })
    }

    static add_task(token, task){
        let url = `https://beta.todoist.com/API/v8/tasks`;
        let headers = {
            Authorization: `Bearer ${token}`
        }
        let body = {
            content: task
        }

        return request.postAsync({
            url: url,
            headers: headers,
            body: body,
            json: true
        }).then((response) => {
            debug(response.body);
            return response.body;
        })
    }

    /**
    Method to generate random string.
    @method
    @return {Number}
    */
    static _random(){
        return crypto.randomBytes(20).toString('hex');
    }
}
