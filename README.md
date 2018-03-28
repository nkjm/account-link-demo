# Overview

This is a sample LINE bot which implements account link to link LINE with Todoist.

# What is account link?

Account link is the LINE API and the best practice to securely link LINE account with another services.

1. Request link token for LINE server.
1. Redirect user to authentication URL of the external service to retrieve the credential.
1. Generate nonce and saving credential using nonce as key.
1. Redirect user to LINE server with link token and nonce to verify the user is not spoofed.
1. LINE notify the verification result by sending accountLink event to the webhook of Messaging API.
1. Bot can save the linkage of LINE and external service to arbitrary database.

# Demo

1. Add todoist-bot as friend.

    ![qrcode](./image/qrcode.png)

1. Link with your todoist account.

1. Say "todo Buy milk".

1. Open todoist and checkout if "Buy milk" task has been added to Inbox.


# Lauch your own instance

*You need to have todoist and LINE account*

- Create a new channel of LINE Messaging API in [LINE developer console](https://developers.line.me/console/)
- Create a new app in [Todoist App Management](https://developer.todoist.com/appconsole.html)
- Deploy bot instance to heroku.

    [![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)
