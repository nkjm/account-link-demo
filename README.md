# Overview

This is a sample LINE bot which implements account link to link LINE with Todoist.

# Demo

*Pls be noted that following QR code is for beta so you need to try with beta account.*

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

    ```
    $ git clone https://git.linecorp.com/kazuki-nakajima/account-link-demo.git
    $ git remote add heroku YOUR_HEROKU_GIT_URL
    $ git push heroku master
    ```

- Set following environment variables
    - LINE_CLIENT_SECRET
    - LINE_ACCESS_TOKEN
    - TODOIST_CLIENT_ID
    - TODOIST_CLIENT_SECRET
    - TODOIST_REDIRECT_URI
