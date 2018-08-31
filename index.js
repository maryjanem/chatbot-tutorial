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

//Default dialog - used when the chatbot can't handle an utterance
bot.dialog('/', function(session) {
	session.send('I\’m not sure how to answer that.');
	session.endDialog();
 });

//----------------------------------------------------
//Greeting dialog
//----------------------------------------------------
bot.dialog('Greeting', function (session) {
    session.send('Hello, I\'m your virtual guide to ConverCon. Ask me anything!');
    session.endDialog();
}).triggerAction({
    matches: [/^hello*$|^hi*$/i]
});

//----------------------------------------------------
//About dialog
//----------------------------------------------------
bot.dialog('About', function(session){
    var card = new builder.HeroCard(session)
        .title('ConverCon is...')
        .text('Bringing together the world’s leading conversational interfaces platform players, technology enablers, next level CX design experts and the business community to share enthusiasm, learnings and experiences')
        .images([
            builder.CardImage.create(session, 'https://www.convercon.ie/wp-content/uploads/2017/09/convlogo-vector.png')
        ]).buttons([
            builder.CardAction.imBack(session, 'Who are your sponsors?', 'Find Out About Sponsors')
        ]);
    var msg = new builder.Message(session).addAttachment(card);
    session.endDialog(msg);
});

//----------------------------------------------------
//Sponsors dialog
//----------------------------------------------------
bot.dialog('Sponsors', function(session){
    var card = new builder.HeroCard(session)
        .title('ConverCon 2018 Sponsors')
        .text('This is a list of this year\'s ConverCon sponsors...')
        .images([
            builder.CardImage.create(session, 'https://image.ibb.co/nP7V0z/Screen_Shot_2018_08_20_at_14_16_09.png')
        ]);
    var msg = new builder.Message(session).addAttachment(card);
    session.endDialog(msg);
});
