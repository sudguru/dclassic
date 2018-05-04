var sc2 = require('sc2-sdk');

var api = sc2.Initialize({
  app: 'steemporn.app',
  callbackURL: 'http://localhost:8080/connect',
  accessToken: 'access_token',
  scope: ['vote', 'comment']
});

var link = api.getLoginURL(state);
console.log(link)