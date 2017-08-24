var request = require("request");
var xml2js = require('xml2js');

var xmlParser = new xml2js.Parser();

module.exports = function(bot, taID) {
	// write your easter egg message handler function in here
	// then include it in the `return` statement below

	// IMPORTANT: always include a parameter for a callback function
	// and make sure to call the callback function at the end of your message handler
	// parameters for all message handlers should be `message` and `callback`

	// `validate` is simply a helper to make sure the message is meant for the bot
	function validate(message) {
		return message.type === "message" && message.text !== undefined && message.text.indexOf(bot.mention) > -1;
	}

	// paramify is useful if wording of the message is important
	// returns the message in an array of words without the mention at the beginning
	function paramify(message) {
		var commandString = message.text.replace(bot.mention, "").replace(/\:/g, "").toLowerCase();
		var command = commandString.split(" ");
		if (command[0] === "") {command.shift();}
		return command;
	}

	var quoteMachine = function(message, cb) {
		if (validate(message) && message.text.indexOf(':movie_camera:') > -1) {
      const options = {
        uri: 'https://andruxnet-random-famous-quotes.p.mashape.com/cat=',
        headers: {
          'X-Mashape-Key': 'OivH71yd3tmshl9YKzFH7BTzBVRQp1RaKLajsnafgL2aPsfP9V',
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        json: true
      };
			request(options, function(err, response, body) {
        bot.sendMessage(message.channel, '"' + body.quote + '" - ' + body.author);
      })
		}
		cb(null, 'quoteMachine');
	};

	var trainStatus = function(message, cb) {
		if (validate(message)) {
			var command = paramify(message);
      // console.log('result for paramify inside trainStatus->', command);
			if (command[0] === "is" && command[1] === "the" && command[3] === "train" && (command[4] === "fucked" || command[4] === "fucked?")) {
				var trainLineQuery = command[2];
				request("http://web.mta.info/status/serviceStatus.txt", function(err, response, body) {
					xmlParser.parseString(body, function(err, result) {
						var lines = result.service.subway[0].line;
						var lineQueried = lines.filter(function(line) {
							return line.name[0].toLowerCase().indexOf(trainLineQuery) > -1;
						});
						var botMessage;
						if (lineQueried[0].status[0] === 'GOOD SERVICE') { // ? "Nope" : "Yep";
							botMessage = Math.random() < 0.5 ? `Nope, the ${trainLineQuery} is fine` : `Nah, the ${trainLineQuery} is fine`;
						} else {
							botMessage = `Yep, the ${trainLineQuery} is totally fucked`;
						}
						bot.sendMessage(message.channel, botMessage);
					});
				});
			}
		}
		cb(null, 'trainStatus');
	};

  // --> `gracehopper I am here` (RESTRICTED TO TA'S)
  // var floorMessage = function(message, cb) {
  //   // console.log("inside floor message TAId", taID);
  //   if (validate(message) && taID.includes(message.user)) {
  //     var command = paramify(message);
  //     if ((command[0] === "I" || command[0] === "i") && command[1] === "am" && (command[2] === "here" || command[2] === "here!")) {
  //       bot.api("users.info", {user: message.user}, function(data) {
  //         var currentTA = data.user;
  //         var botMessage =  currentTA.profile.real_name + " is in the SRC, located at the back of the 4th floor. Need help? Queue up! (after you Google your question first, of course) :the-more-you-know:";
  //         bot.sendMessage(message.channel, botMessage);
  //       })
  //     }
  //   }
  //   cb(null, 'floorMessage');
  // }

  // var leavingMessage = function(message, cb) {
  //   // console.log("inside floor message TAId", taID);
  //   if (validate(message) && taID.includes(message.user)) {
  //     var command = paramify(message);
  //     if ((command[0] === "I" || command[0] === "i") && command[1] === "am" && (command[2] === "done" || command[2] === "done!" || command[2] === "gone" || command[2] === "gone!")) {
  //       bot.api("users.info", {user: message.user}, function(data) {
  //         var currentTA = data.user;
  //         var botMessage =  currentTA.profile.real_name + " is done with his shift!, Thank you!";
  //         bot.sendMessage(message.channel, botMessage);
  //       })
  //     }
  //   }
  //   cb(null, 'leavingMessage');
  // }

  var favoriteThings = function(message, cb) {
    if (validate(message)) {
      let favoriteArray = ["And Shawshank Redemption, best movie ever!" ,"And burritos, Oxido and Dos Toros are the two best spots near campus!" ,"And outerspace, it is the great unknown and mankind's ultimate frontier!", "And video games, that new Zelda is dope!", "And Dippin' Dots, the ice cream of astronauts!", "And algorithms, I'm a genius in case you didn't know!", "And eqaulity, our similarities are more powerful than our differences!", "And black and white cookies, the embodiment of racial harmony in cookie form. Look to the cookie!"]
      var command = paramify(message);
      if ((command[0] === "What" || command[0] === "what") && command[1] === "is" && command[2] === "your" && command[3] === "favorite" && command[4] === "thing?") {
        var botMessage =  "Seeing the students faces in their profile pictures! ..." + favoriteArray[Math.floor(Math.random() * favoriteArray.length)];
      }
      bot.sendMessage(message.channel, botMessage);
    }
    cb(null, 'favoriteThings');
  }

  var doYouLike = function(message, cb) {
    if (validate(message)) {
      let answers = ["Kinda", "Of course!", "Eh", "Sometimes", "To be honest, not really", "Very much!", "You're the best!", "Oh yea! If you were a pen, you'd be FINE point", "You know it!", "If you were a contract, you'd be all FINE print", "Well, you're ok", "Depends... do YOU like ME?", "Like, more than a friend?", "Marry me!"]
      var command = paramify(message);
      if ((command[0] === "Do" || command[0] === "do") && command[1] === "you" && command[2] === "like" && command[3] === "me?") {
        var botMessage =  answers[Math.floor(Math.random() * answers.length)];
      }
      bot.sendMessage(message.channel, botMessage);
    }
    cb(null, 'doYouLike');
  }

  var thanks = function(message, cb) {
    if (validate(message)) {
      let emojis = ["bluesteel", "panda", "banana-dance", "turkey-dance", "success", "bobafett", "fieri_parrot", "lucy", "minion", "bender", "nemo", "powerup", "pug", "psy", "pundog", "woodstock", "yoga"];
      var command = paramify(message);
      if (command[0] === "Thanks!" || command[0] === "thanks!" || command[0] === "thanks" || command[0] === "Thanks") {
        var botMessage =  "You're very welcome :" + emojis[Math.floor(Math.random() * emojis.length)] + ":";
      };
      if ((command[0] === "Thank" || command[0] === "thank") && (command[1] === "you" || command[1] === "you!")) {
        var botMessage =  "You're very welcome :" + emojis[Math.floor(Math.random() * emojis.length)] + ":";
      }
      bot.sendMessage(message.channel, botMessage);
    }
    cb(null, 'thanks');
  }

	 var howAwesome = function(message, cb) {
    if (validate(message)) {
      var command = paramify(message);
      if( (command[0] === 'how' || command[0] === 'How') && command[1] === 'awesome' && command[2] === 'is' && ((command[3] === 'Dominic?' || command[3] === 'dominic?') || (command[3] === 'matt?' || command[3] === 'Matt?') || (command[3] === 'Jason?' || command[3] === 'jason?') || (command[3] === 'taka?' || command[3] === 'Taka?')) )    {
				var botMessage =  "His awesomeness is over 9,000!"
      }
      bot.sendMessage(message.channel, botMessage);
    }
    cb(null, 'howAwesome');
  }

	// var wakeUp = function(message, cb) {
	// 	if (validate(message)) {
	// 		var command = paramify(message);
	// 		if ( (command[0] === "Grace" || command[0] === 'grace') && command[1] === "are" && command[2] === "you" && command[3] === "up?") {
	// 			var botMessage =  "Yea, yea... I'm up. What do you need?"
	// 		}
	// 		bot.sendMessage(message.channel, botMessage);
	// 	}
	// 	cb(null, 'wakeUp');
	// }

	var theDom = function(message, cb) {
		if (validate(message)) {
			var command = paramify(message);
			if ( (command[0] === 'Tell' || command[0] === 'tell') && command[1] === 'me' && command[2] === 'about' && command[3] === 'the' && (command[4] === 'DOM.' || command[4] === 'dom.' ) ) {
				var botMessage =  'The Dominic Object Model is an important concept in web development!'
			}
			bot.sendMessage(message.channel, botMessage);
		}
		cb(null, 'theDom');
	}

	const virtualDom = (message, cb) => {
		if (validate(message)) {
			var command = paramify(message);
			// console.log('The Virtual Dom!', command)
			if ( (command[0] === 'Tell' || command[0] === 'tell') && command[1] === 'me' && command[2] === 'about' && command[3] === 'the' && command[4] === 'virtual' && (command[5] === 'DOM.' || command[5] === 'dom.' ) ) {
				var botMessage =  'The Virtual Dominic Object Model is an important concept in React!'
			}
			bot.sendMessage(message.channel, botMessage);
		}
		cb(null, 'virtualDom');
	}

	const heart = (message, cb) => {
			if (validate(message)) {
				var command = paramify(message);
				// console.log('heart!', command)
			if (command[0] === 'heart' ) {
				var botMessage =  ':heart:';
			}
			bot.sendMessage(message.channel, botMessage);
		}
		cb(null, 'heart');
	}


	return {
		quoteMachine,
		trainStatus,
    // floorMessage,
    favoriteThings,
    doYouLike,
    thanks,
		howAwesome,
		// wakeUp,
		theDom,
		virtualDom,
		heart
	};

}; // module.exports
