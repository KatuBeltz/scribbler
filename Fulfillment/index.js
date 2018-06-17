// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';

const firebase = require('firebase');
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

// Setup the DB

var config = {
   apiKey: "AIzaSyCwwtdx8ZXszIji_aL_9DK7xzEogX7DqIE",
   authDomain: "test-scribe-86802.firebaseapp.com",
   databaseURL: "https://test-scribe-86802.firebaseio.com",
   projectId: "test-scribe-86802",
   storageBucket: "test-scribe-86802.appspot.com",
   messagingSenderId: "279073397492"
};

firebase.initializeApp(config);
//firebase.firestore.setLogLevel("debug");
var db = firebase.firestore();




exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
 const agent = new WebhookClient({ request, response });
 console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
 console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

 function note(agent) {
     let conv = agent.conv();

     console.log("Agent: ");
     console.log(agent);
     console.log("Conversation:");
     console.log(conv);
     console.log("Conv data:");
     console.log(conv.data);

     const text = agent.parameters.read;
     const originalText = agent.parameters.origText;
     var conversation_class = null;
     var conversation_given_name = null;
     var conversation_last_name = null;
     var conversation_location = null;
     var conversation_time_period = null;
     var conversation_date = null;

     if (typeof agent.parameters.class !== 'undefined') {
     //if(agent.parameters.hasAttribute(“class”)) {
       conversation_class = agent.parameters.class;
       //agent.add(conversation_class);
     }

     if (typeof agent.parameters.givenName !== 'undefined') {
       conversation_given_name = agent.parameters.givenName;
       //agent.add(conversation_given_name);
     }

     if (typeof agent.parameters.lastName !== 'undefined') {
       conversation_last_name = agent.parameters.lastName;
       //agent.add(conversation_last_name);
     }

     if (typeof agent.parameters.location !== 'undefined') {
       conversation_location = agent.parameters.location;
       //agent.add(conversation_location);
     }

     if (typeof agent.parameters.timePeriod !== 'undefined') {
       conversation_time_period = agent.parameters.timePeriod;
       //agent.add(conversation_time_period);
     }

     if (typeof agent.parameters.date !== 'undefined') {
       conversation_date = agent.parameters.date;
       //agent.add(conversation_date);
     }

   //const userID = CLIENT_ID;
   //agent.add(userID);

   let user_id = conv.user.id;
   let conv_id = conv.request.conversation.conversationId;

   console.log('user id: ', user_id);
   console.log('conv id: ', conv_id);

   console.log("Adding a new note... (old school) ");
   var docRef = db.collection('users').doc(user_id).collection(conversation_class).doc(conv_id);
   var setNote = docRef.set({
               conversation_given_name: conversation_given_name,
               conversation_last_name: conversation_last_name,
               conversation_location: conversation_location,
               conversation_time_period: conversation_time_period,
               conversation_date: conversation_date,
               text: text,
               initial_text: originalText});

   //var docRef = db.collection('users').doc('alovelace');
   /*let user_id = conv.user.id;
   let conv_id = conv.request.conversation.conversationId;
   console.log('user id: ', user_id);
   console.log('conv id: ', conv_id);
   var docRef = db.collection('users').doc(user_id).collection(conversation_class).doc(conv_id);
   //var docRef = db.collection('users').doc(conv.user.id).collection(conversation_class).doc(conv.user.id);
   var getDoc = docRef.get()
       .then(doc => {
         if (!doc.exists) {
           console.log("Adding a new note... ");
           var setNote = docRef.set({
               conversation_given_name: conversation_given_name,
               conversation_last_name: conversation_last_name,
               conversation_location: conversation_location,
               conversation_time_period: conversation_time_period,
               conversation_date: conversation_date,
               text: text,
               initial_text: originalText});
           console.log("conversation_date ", conversation_date);
           console.log("conversation_given_name ", conversation_given_name);
           console.log("conversation_last_name ", conversation_last_name);
           console.log("conversation_location ", conversation_location);
           console.log("conversation_time_period ", conversation_time_period);
           console.log("text ", text);
           console.log("initial_text ", originalText);
         } else {
           console.log("Appending data...");
           console.log(doc.data().text);
           getDoc.set({text: doc.data().text + ' ' + text})
         }
       })
       .catch(err => {
         console.log('Error getting document', err);
       });*/

   agent.add("Great! Everything is evaporating into the cloud.");
   console.log("User Text:");
   console.log(text);
   //agent.add(originalText);
 }



 // // Uncomment and edit to make your own intent handler
 // // uncomment `intentMap.set('your intent name here', yourFunctionHandler);`
 // // below to get this function to be run when a Dialogflow intent is matched
 // function yourFunctionHandler(agent) {
 //   agent.add(`This message is from Dialogflow's Cloud Functions for Firebase editor!`);
 //   agent.add(new Card({
 //       title: `Title: this is a card title`,
 //       imageUrl: 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png',
 //       text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
 //       buttonText: 'This is a button',
 //       buttonUrl: 'https://assistant.google.com/'
 //     })
 //   );
 //   agent.add(new Suggestion(`Quick Reply`));
 //   agent.add(new Suggestion(`Suggestion`));
 //   agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' }});
 // }

// Uncomment and edit to make your own Google Assistant intent handler
// uncomment `intentMap.set('your intent name here', googleAssistantHandler);`
// below to get this function to be run when a Dialogflow intent is matched
// function googleAssistantHandler(agent) {
 // let conv = agent.conv(); // Get Actions on Google library conv instance
 // conv.ask('Hello from the Actions on Google client library!') // Use Actions on Google library
//  agent.add(conv); // Add Actions on Google library responses to your agent's response
//}
// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs/tree/master/samples/actions-on-google
// for a complete Dialogflow fulfillment library Actions on Google client library v2 integration sample

 // Run the proper function handler based on the matched Dialogflow intent name
 let intentMap = new Map();
 intentMap.set('startRecord - no', note);
 intentMap.set('startRecord - yes', note);
 intentMap.set('continueRecord - no', note);
 intentMap.set('continueRecord - yes', note);
 // intentMap.set('your intent name here', yourFunctionHandler);
 //intentMap.set('note_text', googleAssistantHandler);
 agent.handleRequest(intentMap);
});
