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

var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/a3fb0304-bbbc-4715-a0d2-2d994a897029?subscription-key=415c693e2792428ebf5c3266b0202c68&verbose=true&timezoneOffset=0&q=');
bot.recognizer(recognizer);

bot.dialog('/', function(session) {
	session.send('I\’m not sure how to answer that.');
	session.endDialog();
 });

 bot.dialog('Greeting', function(session) {
	session.send('Hello, I can help you book a train ticket. Just say `book` to get started!');
    session.endDialog();
 }).triggerAction({
	matches:'Greeting'
});

bot.dialog('Book', [
    function (session) {
        session.beginDialog('Depart');
    },
    function (session, results) {
        if(results.response){
            session.conversationData.depart = results.response;
        }
        session.beginDialog('Arrive');
    },
    function (session, results) {
        if(results.response){
            session.conversationData.arrive = results.response;
        } 
        session.beginDialog('DateDeparture');
    },
    function (session, results) {
        if(results.response){
            session.conversationData.date = results.response;
        } 
        session.beginDialog('TicketType');
    },
    function (session, results) {
        if(results.response){
            session.conversationData.type = results.response;
        }
        session.beginDialog('TicketQuantity');
    },
    function(session, results){
        if(results.response){
            session.conversationData.quantity = results.response;
        }
        session.beginDialog('Confirm');
    },
    function(session, results){
        session.conversationData.confirm = results.response;
        if(session.conversationData.confirm === 'yes'){
            session.endConversation('Your train has been booked.');
        } else {
            session.endConversation('Say `book` to restart');
        }
    }
]).triggerAction({
    matches: 'BookTrain'
});


//----------------------------------------------------
//Waterfall steps
//----------------------------------------------------
 bot.dialog('Depart', [
    function (session) {
        builder.Prompts.text(session, "Where are you departing from?"); 
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
]);

bot.dialog('Arrive', [
    function (session) {
        builder.Prompts.text(session, "Where are you going to?"); 
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
]);

bot.dialog('DateDeparture', [
    function (session) {
        builder.Prompts.text(session, "What date would you like to depart?");
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
]);

bot.dialog('TicketType', [
    function (session) {
        builder.Prompts.text(session, "Would you like an adult or child ticket?");
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
]);

bot.dialog('TicketQuantity', [
    function (session) {
        builder.Prompts.text(session, "How many tickets do you need?");
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
]);

bot.dialog('Confirm', [
    function(session) {
        var confirmation = 'Are these details correct? ' +
            '\r\rDepart From: ' + session.conversationData.depart +
            '\r\rArrive At: ' + session.conversationData.arrive +
            '\r\rReply with `yes` or `no`';
        builder.Prompts.text(session, confirmation);
    },
    function(session, results){
        session.endDialogWithResult(results);
    }
]);
