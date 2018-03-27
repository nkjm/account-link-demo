{
  "name": "LINE account link demo",
  "description": "A sample bot which implements account link to link LINE with Todoist.",
  "repository": "https://github.com/nkjm/account-link-demo",
  "logo": "https://raw.githubusercontent.com/nkjm/account-link-demo/master/image/logo.png",
  "env": {
      "LINE_CHANNEL_SECRET": {
          "description": "Secret key to validate the access to your webhook. You can find it in LINE Developers Console.",
          "required": true
      },
      "LINE_ACCESS_TOKEN": {
          "description": "Token to add to your API call for LINE Messaging API. You can find it in LINE Developers Console.",
          "required": true
      },
      "TODOIST_CLIENT_ID": {
          "description": "Todoist Client ID",
          "required": true
      },
      "TODOIST_CLIENT_SECRET": {
          "description": "Todoist Client Secret",
          "required": true
      },
      "TODOIST_REDIRECT_URI": {
          "description": "Todoist redirect URI",
          "required": true
      },
      "DEBUG": {
          "description": "Flag to switch debugging level and target scripts.",
          "required": false,
          "value": "bot-express:*"

      }
  },
  "keywords": ["line", "bot", "chatbot", "sushi"]
}
