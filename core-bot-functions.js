var fs = require('fs');
const {getDB} = require('./lib/dbConnect.js')

var queue;
var loggedTAs;

// backs up the queue as a JSON object inside a local db.json file
function backup(queueArray) {
  console.log('inside backup queue');
  // write the queue array to file
  fs.writeFile('./db.json', JSON.stringify({queue: queueArray}), (err) => {
    if(err) console.log('queue backup unsuccessful');
  });
}

function backckupTAs(taArray) {
  console.log('inside backup tas');
  // write the TA array to file
  fs.writeFile('./ta.json', JSON.stringify({loggedTAs: taArray}), (err) => {
    if(err) console.log('loggedTAs backup unsuccessful');
  });
}

// try and pick up the queue form db.json before declaring an empty queue
try {
  queue = JSON.parse(fs.readFileSync('./db.json', 'utf8')).queue;
  loggedTAs = JSON.parse(fs.readFileSync('./ta.json', 'utf8')).queue;
} catch(e) {
  queue = [];
  // empty student queue mongodb
  loggedTAs = [];
  // empty ta
  backup(queue);
  backckupTAs(loggedTAs);
}

// function that returns only names from the current queue
var prettyQueue = function() {
  var queueArray = queue.map(function(user) {
    return user.profile.real_name;
  });
  return "Current queue is now: " + (queueArray.length ? queueArray.join(", ") : "empty");
};

// this is the module being exported to app.js
module.exports = function(bot, taIDs) {

  var gracehopper = function(message, cb) {
    // the if/else if statements are for commands that don't rely
    // on the wording as much

    if (message.type === "message" && message.text !== undefined && message.text.indexOf(bot.mention) > -1) {
      // State Message checks
      var statusMessage     = message.text.indexOf("status") > -1,
          queueMeMessage    = message.text.indexOf("queue me") > -1 || message.text.indexOf("q me") > -1,
          removeMeMessage   = message.text.indexOf("remove me") > -1,
          nextMessage       = message.text.indexOf("next") > -1 && taIDs.includes(message.user),
          helpMessage       = message.text.indexOf("help") > -1,
          clearQueueMessage = message.text.indexOf("clear queue") > -1 && taIDs.includes(message.user),
          easterEggs        = message.text.indexOf("easter eggs" || "Easter eggs") > -1,
          goodnight         = message.text.indexOf("goodnight") > -1;
          // iAmHere           = message.text.indexOf("i am here" || "I am here") > -1;

      // --> `gracehopper status`
      if (statusMessage) {
        bot.sendMessage(message.channel, prettyQueue());

      // --> `grachopper queue me`
      } else if (queueMeMessage) {
        // adding a user to the queue
        if (queue.filter(function(e) {return e.id === message.user}).length === 0) {
          bot.api("users.info", {user: message.user}, function(data) {
            queue.push(data.user);
            bot.sendMessage(message.channel, prettyQueue());
            // using fs to write a backup of queue on file
            backup(queue);
          });
        } else {
          bot.sendMessage(message.channel, "Already in queue. " + prettyQueue());
        }

      // --> `gracehopper remove me`
      } else if (removeMeMessage) {
        // removing a user
        var userToRemove = queue.filter(function(user) {return user.id === message.user});
        if (userToRemove.length) {
          queue.splice(queue.indexOf(userToRemove[0]), 1);
          bot.sendMessage(message.channel, ":wave: " + prettyQueue());
          backup(queue);
        }

      // --> `gracehopper next`
      } else if (nextMessage) {
        // next student
        var currentStudent = queue.shift();
        if (currentStudent) {
          bot.api("users.info", {user: message.user}, function(data) {
          console.log("message", message);
          console.log("nextMessage firing: ", data);
          console.log("current Student: ", currentStudent);
            var currentTA = data.user;
            console.log("currentTA: ", currentTA)
            bot.sendMessage(message.channel, "Up now with " + currentTA.profile.real_name + ": <@" + currentStudent.id + "> -- " + prettyQueue());
            backup(queue);
          });
        } else {
          // send message saying no one in queue
          bot.sendMessage(message.channel, "No one in the queue :rice_ball:");
        }

      // --> `gracehopper eastereggs`
      } else if (easterEggs) {
        bot.sendMessage(message.channel, "Tag me and try these commands: `Do you like me?`, `What is your favorite thing?`, `is the (train line) train fucked?`, `Tell me about the Dom.`, `:movie_camera:`, `How awesome is (insert name of TA here)`, `heart`, `Grace are you up?`. And if you dig what I'm saying, just say `Thanks!` :smile:")

      // --> `gracehopper goodnight`
      } else if (goodnight) {
        bot.sendMessage(message.channel, "Have a goodnight!")

      // --> `gracehopper help`
      } else if (helpMessage) {
        // help message
        bot.sendMessage(message.channel, "All commands work only when you specifically mention me. Type `queue me` or `q me` to queue yourself and `status` to check current queue. Type `remove me` to remove yourself.")

      // --> `gracehopper clear queue` (RESTRICTED TO TA'S)
      } else if (clearQueueMessage) {
        // add condition that only allows TA's to CLEAR queue
        bot.api("users.info", {user: message.user}, function(data) {
          let currentTA = data.user;

          // check if the emmiter is actually allowed to do this clear queue
          if(taIDs.indexOf(`${currentTA.id}`) >= 0) {
            queue = [];
            bot.sendMessage(message.channel, `Queue cleared, ${currentTA.name} have a :tropical_drink:`);
            backup(queue);
          } else {
            bot.sendMessage(message.channel, "You are not authorized to do that");
          }
        });
      }

    } else if(message.type === "hello") {
      console.log("grace hopper connected...");
    }
    cb(null, 'core-bot');
  };
  return gracehopper;
};
