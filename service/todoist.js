"use strict";

const debug = require("debug")("service");
const request = require("request");
Promise.promisifyAll(request);

module.exports = class ServiceTodoist {
    static get_auth_url(state){
        let client_id = encodeURIComponent(process.env.TODO_CLIENT_ID);
        let scope = encodeURIComponent("task:add");
        let url = `https://todoist.com/oauth/authorize?client_id=${client_id}&scope=${scope}&state=${state}`;

        return url;
    }

    static get_token(code){
        let url = `https://todoist.com/oauth/access_token`;
        let body = {
            client_id: encodeURIComponent(process.env.TODO_CLIENT_ID),
            client_secret: encodeURIComponent(process.env.TODO_CLIENT_SECRET),
            redirect_uri: encodeURIComponent(process.env.TODO_REDIRECT_URI)
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

    /**
    Method to generate random string.
    @method
    @return {Number}
    */
    static _random(){
        return crypto.randomBytes(20).toString('hex');
    }
}
