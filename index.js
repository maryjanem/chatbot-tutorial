//Imports
var builder = require('botbuilder'); //Microsoft BotFramework SDK for building chatbots
var restify = require('restify'); //Framework for RESTful services

//The ChatConnector enables communication between bot and user via various channels
//such as Web, Slack, Facebook, Skype, etc.
var connector = new builder.ChatConnector({
    appId: '',
    appPassword: ''
});

//Create a restify server and set it to listen to port 3978
var server = restify.createServer();
server.listen(3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

//Create URI that listens for new messages via the connector
server.post('/api/messages', connector.listen());

//Create a new 'bot' variable that is type UniversalBot with MemoryBotStorage
//MemoryBotStorage saves the session state
var inMemoryStorage = new builder.MemoryBotStorage();
var bot = new builder.UniversalBot(connector).set('storage', inMemoryStorage);
