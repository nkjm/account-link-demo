"use strict";

const jsforce = require('jsforce');

module.exports = class ServiceUserDb {
    static get_auth_url(){
        let oauth2 = new jsforce.OAuth2({
          // you can change loginUrl to connect to sandbox or prerelease env.
          // loginUrl : 'https://test.salesforce.com',
          clientId : process.env.SF_CLIENT_ID,
          clientSecret : process.env.SF_CLIENT_SECRET,
          redirectUri : process.env.SF_REDIRECT_URI
        });

        return oauth2.getAuthorizationUrl({ scope : 'api id web' });
    }

    static get_token(code){
        let oauth2 = new jsforce.OAuth2({
          // you can change loginUrl to connect to sandbox or prerelease env.
          // loginUrl : 'https://test.salesforce.com',
          clientId : process.env.SF_CLIENT_ID,
          clientSecret : process.env.SF_CLIENT_SECRET,
          redirectUri : process.env.SF_REDIRECT_URI
        });

        let conn = new jsforce.Connection({ oauth2 : oauth2 });
        return conn.authorize(code).then((response) => {
            debug(response);
            return response;
        });
    }

    /**
    @param {Object} user - user object to upsert.
    @param {String} user.user_id - user id.
    @param {String} user.line_user_id - line user id.
    */
    static save(user){
        // Upsert user.
    }
}
