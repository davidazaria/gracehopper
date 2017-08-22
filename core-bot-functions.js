var fs = require('fs');
const {getDB} = require('./lib/dbConnect.js')

var queue;
var loggedTAs;

// backs up the queue as a JSON object inside a local db.json file
function backup(queueArray) {
  // console.log('inside backup student queue');
  // write the queue array to file
  fs.writeFile('./db.json', JSON.stringify({queue: queueArray}), (err) => {
    if(err) console.log('queue backup unsuccessful');
  });
}

function backckupTAs(taArray) {
  // console.log('inside backup ta queue');
  // write the TA array to file
  fs.writeFile('./ta.json', JSON.stringify({loggedTAs: taArray}), (err) => {
    if(err) console.log('loggedTAs backup unsuccessful');
  });
}

// try and pick up the queue form db.json before declaring an empty queue
try {
  queue = JSON.parse(fs.readFileSync('./db.json', 'utf8')).queue;
  console.log('picking up queue ->',queue.length);
} catch(e) {
  queue = [];
  backup(queue);
}

// same thing for the TA queue
try {
  loggedTAs = JSON.parse(fs.readFileSync('./ta.json', 'utf8')).loggedTAs;
  console.log('picking up tas ->', loggedTAs.length);
} catch(e) {
  loggedTAs = [];
  backckupTAs(loggedTAs);
}

// function that returns only names from the current queue
var prettyQueue = function() {
  var queueArray = queue.map(function(user) {
    return user.profile.real_name;
  });
  return "*Current queue is now:* \n" + (queueArray.length ? queueArray.join(",\n") : "empty 🌑");
};

var taQueue = function() {
  let queueArray = loggedTAs.map( ta => {
    return ta.profile.real_name;
  });
  return "*Current TA's available now:* \n" + (queueArray.length ? queueArray.join(",\n") : "empty 🌑");queueArray;
}

// this is the module being exported to app.js
module.exports = function(bot, taIDs) {


  var gracehopper = function(message, cb) {
    // the if/else if statements are for commands that don't rely
    // on the wording as much
    // paramify is useful if wording of the message is important
    // returns the message in an array of words without the mention at the beginning
    // function paramify(message) {
    //   var commandString = message.text.replace(bot.mention, "").replace(/\:/g, "").toLowerCase();
    //   var command = commandString.split(" ");
    //   if (command[0] === "") {command.shift();}
    //   return command;
    // }

    if (message.type === "message" && message.text !== undefined && message.text.indexOf(bot.mention) > -1) {
      // State Message checks
      // console.log('the start of gracehopper -> ', message.text);
      // console.log(paramify(message));
      var statusMessage     = message.text.match(/status/ig), // works rgx
          queueMeMessage    = message.text.match(/(queue me)|(q me)|(qme)/ig), // works rgx
          removeMeMessage   = message.text.match(/remove me/ig), // works rgx
          nextMessage       = taIDs.includes(message.user) ? message.text.match(/next/ig) : undefined, // works rgx
          helpMessage       = message.text.match(/help/ig), // works rgx
          clearQueueMessage = taIDs.includes(message.user) ? message.text.match(/(clear queue)|(clear q)/ig) : undefined, // works rgx
          clearTAs          = taIDs.includes(message.user) ? message.text.match(/clear tas/ig) : undefined, // works rgx
          easterEggs        = message.text.match(/(easter eggs)/ig),
          goodnight         = message.text.match(/(goodnight)|(good night)/ig), // works rgx
          goodbye           = message.text.match(/goodbye/ig),
          iAmHere           = taIDs.includes(message.user) ? message.text.match(/i am here/ig) : undefined,
          taSchedule        = message.text.match(/(ta schedule)|(schedule)/ig); // works rgx
          // iAmDone           =
      // --> `gracehopper status`
      if (statusMessage) {
        bot.sendMessage(message.channel, prettyQueue());
        bot.sendMessage(message.channel, taQueue());

      // --> `grachopper queue me`
      } else if (queueMeMessage) {
        // console.log('q me message triggered', queueMeMessage);
        if (loggedTAs.length > 0) {
          // adding a user to the queue
          // if message.user is not in the queue
          if (queue.filter(function(e) {return e.id === message.user}).length === 0) {
            // check if they queued with a message goes here
            // console.log(`he's queueing up with a message of... `,message.text)


            bot.api("users.info", {user: message.user}, function(data) {
              queue.push(data.user);
              bot.sendMessage(message.channel, prettyQueue());
              // using fs to write a backup of queue on file
              backup(queue);
            });
          } else {
            bot.sendMessage(message.channel, "Already in queue. " + prettyQueue());
          }

        } else {
          bot.sendMessage(message.channel, "Cannot queue up now. No TA's Available");
          bot.sendMessage(message.channel, taQueue());
        }

      // --> `gracehopper remove me`
      } else if (removeMeMessage) {
        // console.log('remove me triggered')
        // removing a user
        var userToRemove = queue.filter(function(user) {return user.id === message.user});
        if (userToRemove.length) {
          queue.splice(queue.indexOf(userToRemove[0]), 1);
          bot.sendMessage(message.channel, ":wave: gracias por participar! \n" + prettyQueue());
          backup(queue);
        } else {
          bot.sendMessage(message.channel, `hun you not even in the queue`);
        }

      // --> `gracehopper next`
      } else if (nextMessage) {
        // next student
        var currentStudent = queue.shift();
        if (currentStudent) {
          bot.api("users.info", {user: message.user}, function(data) {
            var currentTA = data.user;
            // console.log("currentTA: ", currentTA)
            bot.sendMessage(message.channel, "Up now with " + currentTA.profile.real_name + ": <@" + currentStudent.id + "> \n" + prettyQueue());
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
        let msg = `Gracehopper commands work only when you specifically *mention me*.
Type the following:
\`@gracehopper status\` - check current queue.
\`@gracehopper queue me\` - queue yourself.
\`@gracehopper remove me\` - remove yourself.
*\`@gracehopper schedule\` - show TA schedule.*`


        bot.sendMessage(message.channel, msg)

      // --> `gracehopper clear queue` (RESTRICTED TO TA'S)
      } else if (clearQueueMessage) {
        // add condition that only allows TA's to CLEAR queue
        bot.api("users.info", {user: message.user}, function(data) {
          let currentTA = data.user;

          // check if the emmiter is actually allowed to do this clear queue
          if(taIDs.indexOf(`${currentTA.id}`) > -1) {
            queue = [];
            bot.sendMessage(message.channel, `Queue cleared, ${currentTA.name} have a :tropical_drink:`);
            backup(queue);
          } else {
            bot.sendMessage(message.channel, "You are not authorized to do that");
          }
        });


      } else if (goodbye) {
        // console.log('good bye message triggered', message);
        bot.api("users.info", {user: message.user}, function(data) {
          // console.log('the data from the API: ', data);
          let currentUser = data.user;
          if(taIDs.indexOf(currentUser.id) > -1 && loggedTAs.filter(function(user) {return user.id === message.user}).length > 0) {
            console.log('ta in the log too');
            let newTAqueue = loggedTAs.filter(function(user) {return user.id !== message.user})
            loggedTAs = newTAqueue;
            backckupTAs(loggedTAs);
            bot.sendMessage(message.channel, "One TA down... " + loggedTAs.length + " to go!");
          } else {
            // do nothing, just say goodbye
            bot.sendMessage(message.channel, `May the force be with you, ${data.user.name}!`);
          }
        })
        // if(taIDs.indexOf(`${currentTA.id}`) > -1 && loggedTAs.indexof(`${currentTA.id}`) > -1) {
        //     // queue = [];
        //     // bot.sendMessage(message.channel, `Queue cleared, ${currentTA.name} have a :tropical_drink:`);
        //     // backup(queue);
        // } else {
        //     // console.log('not a TA');
        //     // bot.sendMessage(message.channel, "You are not authorized to do that");
        // }
      } else if (iAmHere) {
        // check if this is a TA
        if(taIDs.indexOf(`${message.user}`) > -1) {
        // console.log('i am here message triggered this guy is a TA');

          // grab the data of the user
          bot.api("users.info", {user: message.user}, function(data) {
            let currentTA = data.user;
            // console.log(data.user);

            // check if the TA is already inside the loggedTAs
            if (loggedTAs.filter(function(e) {return e.id === currentTA.id}).length === 0) {
              console.log(`ta not inside loggedTAs `);
              loggedTAs.push(currentTA);
              backckupTAs(loggedTAs);
              var botMessage =  currentTA.profile.real_name + " is in the SRC, located at the back of the 4th floor. Need help? Queue up! (after you Google your question first, of course) :the-more-you-know:";
              bot.sendMessage(message.channel, botMessage);
              bot.sendMessage(message.channel, taQueue());
            } else {
              bot.sendMessage(message.channel, `already logged in ${data.user.name}`);
            }
          });
        } else {
          bot.sendMessage(message.channel, "not a TA my young padawan...");
        }




          //   loggedTAs.push(currentTA);
          //   var botMessage =  currentTA.profile.real_name + " is in the SRC, located at the back of the 4th floor. Need help? Queue up! (after you Google your question first, of course) :the-more-you-know:";
          //   bot.sendMessage(message.channel, botMessage);
          //   backckupTAs(loggedTAs);
          // } else {
          //   bot.sendMessage(message.channel, "You are not authorized to do that");
          // }


        // if message.user is not in the queue


      } else if (taSchedule) {
        // console.log('ta schedule requested', message);
        let sched = `*TA Schedule:*
\`\`\`
| MON | TUE | WED  | THU | FRI | SAT  |
|5pm-9|5pm-9|12pm-3|5pm-9| --- |12pm-3|
\`\`\`
`;
        bot.sendMessage(message.channel, sched);

        // --> clear TA log
      } else if (clearTAs) {
        bot.api("users.info", {user: message.user}, function(data) {
          let currentTA = data.user;

          // check if the emmiter is actually allowed to do this clear ta queue
          if(taIDs.indexOf(`${currentTA.id}`) > -1) {
            loggedTAs = [];
            backckupTAs(loggedTAs);
            bot.sendMessage(message.channel, "NO TAs in the SRC");
          } else {
            bot.sendMessage(message.channel, "You are not authorized to do that");
          }
        });
      }



      // end of options for BOT
    } else if(message.type === "hello") {
      console.log("grace hopper connected...");
    }
    cb(null, 'core-bot');
  };
  return gracehopper;
};
