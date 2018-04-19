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
  };

  // paramify is useful if wording of the message is important
  // returns the message in an array of words without the mention at the beginning
  function paramify(message) {
    var commandString = message.text.replace(bot.mention, "").replace(/\:/g, "").toLowerCase();
    var command = commandString.split(" ");
    if (command[0] === "") {command.shift();}
    return command;
  };

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
  var floorMessage = function(message, cb) {
    // console.log("inside floor message TAId", taID);
    if (validate(message) && taID.includes(message.user)) {
      var command = paramify(message);
      if (
          (command[0] === "I" || command[0] === "i" || command[0] === "Estoy" || command[0] === "estoy") && (command[1] === "am" || command[1] === "aqui") && (command[2] === "here" || command[2] === "here!" || command[2] === "ahora" || command[2] === "ahora!")
      ||
        (
          (
            (command[0] === "我在这里") ||
            ((command[0] === "איך") && (command[1] === "בין") && (command[2] === "דו")) ||
            ((command[0] === "я") && (command[1] === "здесь")) ||
            ((command[0] === "Je" || command[0] === "je") && (command[1] === "suis") && (command[2] === "la")) ||
            ((command[0] === "Ego" || command[0] === "ego") && (command[1] === "adsum")) ||
            ((command[0] === "Mi" || command[0] === "mi") && (command[1] === "estas") && (command[2] === "tie") && (command[3] === "ci"))
          )
        )
      )
    {
        bot.api("users.info", {user: message.user}, function(data) {
          var currentTA = data.user;
          var botMessage =  currentTA.profile.real_name + " is in the hizzouse, located at the back of the 4th floor. Need help? Queue up! (after you Google your question first, of course) :the-more-you-know:";
          bot.sendMessage(message.channel, botMessage);
        })
      }
    }
    cb(null, 'floorMessage');
  };

  var existentialCrisis = function(message, cb) {
    if (validate(message) && taID.includes(message.user)) {
      var command = paramify(message);
      if ((command[0] === "Am" || command[0] === "am") && (command[1] === "I" || command[1] === "i") && (command[2] === "here" || command[2] === "here?")) {
        var botMessage = "Hmmm, good question. Who are you? What are you? Do you exist? How do you know you exist? :mindblown:"
      }
      bot.sendMessage(message.channel, botMessage);
    }
    cb(null, 'existentialCrisis');
  };

    var peterCrisis = function(message, cb) {
    if (validate(message) && taID.includes(message.user)) {
      var command = paramify(message);
      if ((command[0] === "Is" || command[0] === "is") && (command[1] === "Peter" || command[1] === "peter") && (command[2] === "here" || command[2] === "here?")) {
        var botMessage = "No, he's too busy grading homework."
      }
      bot.sendMessage(message.channel, botMessage);
    }
    cb(null, 'peterCrisis');
  };

    var areyouDone = function(message, cb) {
    if (validate(message) && taID.includes(message.user)) {
      var command = paramify(message);
      if ((command[0] === "Are" || command[0] === "are") && (command[1] === "you" || command[1] === "u") && (command[2] === "done" || command[2] === "done?")) {
        var botMessage = "I am! Come back and see me tomorrow!"
      }
      bot.sendMessage(message.channel, botMessage);
    }
    cb(null, 'areyouDone');
  };

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
  };

  var tellMeSomething = function(message, cb) {
    if(validate(message)) {
      let factsArray = [
        "When you're playing a video game that requires stealth, the enemy/AI know exactly where you are at all times, but are forced to not interact with you until one of your actions in-game trigger a line of code.",
        "If Pinocchio said the statement 'My nose will grow now', it would cause a paradox because if his nose grows that would mean he wasn't lying and so his nose shouldn't have grown, but if it doesn't grow, that would mean his statement was a lie and his nose should have grown.",
        "The number `14233221` describes itself; it has one four, two threes, three twos, and two ones.",
        "If 1 human year = 7 dog years, that means 1 human day = 7 dog days. Which explains why they're so excited to see you after a long day. To them, it's been a week.",
        "Scooby Doo is basically a show that teaches kids that the villains in our lives are usually not strangers, but rather people we know and trust.",
        "The word 'crisp' starts at the back of your mouth and ends at the front.",
        "The letter 'W' starts with a 'D'.",
        "Every odd number that exists has the letter 'E' in it.",
        "Your phone doesn't auto-correct when you're typing in all caps because it thinks you are extremely angry and doesn't want to get involved.",
        "Your future self is watching you right now through memories.",
        "A pizza is a circle that comes in a square box that we eat in a triangle.",
        "Blood is thicker than water, but maple syrup is thicker than blood.  Therefore, pancakes are more important than family.",
        "'Finally' is pronounced 'final-e', but 'finale' is pronounced 'fi-nally'.",
        "Lead rhymes with read. Lead rhymes with read.",
        "Cleopatra lived closer in time to the moon landing than the construction of the Great Pyramids.",
        "One million seconds is 11 days. One billion seconds is 31 years.",
        "North Korea and Finland are separated by only one country: Russia.",
        "If your car could drive straight up, outer space is only an hour drive away.",
        "The Nintendo Corporation was created before the fall of the Ottoman Empire.",
        "You have never seen your face, only pictures and reflections.",
        "If you add up the total amount of hours people have played World of Warcraft, it would come out to 6.8 million years.",
        "The surface area of Russia is slightly larger than the surface area of Pluto.",
        "Anne Frank and Martin Luther King Jr. were born in the same year.",
        "High school seniors who graduated in the class of 2015 had never been alive while The Simpsons was not on TV.",
        "The population of Mars consists entirely of robots.",
        "Oxford University is older than the Aztec Empire.",
        "There are more fake flamingos in the world than real flamingos.",
        "New York City is further south than Rome, Italy.",
        "Mammoths went extinct 1,000 years after the Egyptians finished building the Great Pyramid.",
        "Carrots were originally purple.",
        "An octopus has three hearts.",
        "There's enough water in Lake Superior to cover all of North and South America in 1 foot of water.",
        "There is a basketball court on the top floor of the U.S. Supreme Court Building known as the 'highest court in the land'.",
        "'umop apisdn' is 'upside down' spelled upside down.",
        "The name 'Jessica' was created by Shakespeare in the play _Merchant of Venice_.",
        "If you put your finger in your ear and scratch, it sounds just like Pac-Man.",
        "Every year, hundreds of new trees grow because of squirrels forgetting where they buried their nuts.",
        "Alaska is simultaneously the most northern, the most western, and the most eastern state in the U.S.",
        "Vending machines are twice as likely to kill you as a shark is.",
        "Will Smith is now older than Uncle Phil was at the beginning of _The Fresh Prince of Bel-Air_.",
        "There is less time between the existence of the Tyrannosaurus Rex and humans than there was between the Tyrannosaurus Rex and the Stegosaurus."
      ];
      var command = paramify(message);
      if(
          (command[0] === "Tell" || command[0] === "tell") &&
          (command[1] === "me") &&
          (command[2] === "something") &&
          (command[3] === "I" || command[3] === "i") &&
          (command[4] === "don't" || command[4] === "dont" || command[4] === "don’t") &&
          (command[5] === "know")
      ) {
        var botMessage = factsArray[Math.floor(Math.random() * factsArray.length)];
      }
      bot.sendMessage(message.channel, botMessage)
    }
    cb(null, 'tellMeSomething');
  };

  var whatDoIKnow = function(message, cb) {
    if(validate(message)) {
      let factsArray = [
        "That I am the best bot that ever existed and that the SRC is the best group of people on the planet!"
      ];
      var command = paramify(message);
      if(
          (command[0] === "Tell" || command[0] === "tell") &&
          (command[1] === "me") &&
          (command[2] === "something") &&
          (command[3] === "I" || command[3] === "i") &&
          (command[4] === "do" || command[4] === "Do") &&
          (command[5] === "know")
      ) {
        var botMessage = factsArray[Math.floor(Math.random() * factsArray.length)];
      }
      bot.sendMessage(message.channel, botMessage)
    }
    cb(null, 'whatDoIKnow');
  };

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
  };

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
  };

   var howAwesome = function(message, cb) {
    if (validate(message)) {
      var command = paramify(message);
      if( (command[0] === 'how' || command[0] === 'How') && command[1] === 'awesome' && command[2] === 'is' && ((command[3] === 'Dominic?' || command[3] === 'dominic?') || (command[3] === 'matt?' || command[3] === 'Matt?') || (command[3] === 'Jason?' || command[3] === 'jason?') || (command[3] === 'taka?' || command[3] === 'Taka?')) )    {
        var botMessage =  "His awesomeness is over 9,000!"
      }
      bot.sendMessage(message.channel, botMessage);
    }
    cb(null, 'howAwesome');
  };

  var wakeUp = function(message, cb) {
    if (validate(message)) {
      var command = paramify(message);
      if ( (command[0] === "Grace" || command[0] === 'grace') && command[1] === "are" && command[2] === "you" && command[3] === "up?") {
        var botMessage =  "Yea, yea... I'm up. What do you need?"
      }
      bot.sendMessage(message.channel, botMessage);
    }
    cb(null, 'wakeUp');
  };

  var theDom = function(message, cb) {
    if (validate(message)) {
      var command = paramify(message);
      if ( (command[0] === 'Tell' || command[0] === 'tell') && command[1] === 'me' && command[2] === 'about' && command[3] === 'the' && (command[4] === 'DOM.' || command[4] === 'dom.' ) ) {
        var botMessage =  'The Dominic Object Model is an important concept in web development!'
      }
      bot.sendMessage(message.channel, botMessage);
    }
    cb(null, 'theDom');
  };

  var waterBoy = function(message, cb) {
    if (validate(message)) {
        let answers = [
        "Louisiana was named in honor of King Louis XIV, the King of France from 1643-1715.",
        "Just because it’s called the “French Quarter” doesn’t mean that being in New Orleans’ famous neighborhood is like strolling through a Parisian city. Most of the buildings today were influenced by Spanish architecture after a fire in 1794 destroyed most of the French colonial architecture.",
        "Louisiana is the only state that still acts under Napoleonic code, which derives from the original French emperor’s civil code.",
        "There are almost half as many alligators as there are people in Louisiana.",
        "Mardi Gras may be the most well-known celebration in Louisiana, but the festival’s roots can be traced back to medieval Europe.",
        "Speaking of Mardi Gras, each official color has an assigned meaning. Purple stands for justice, gold for power and green for faith.",
        "Baton Rouge is the only site of the American Revolution Battle that was fought outside the original 13 colonies.",
        "Louisiana is the only state in the union that doesn’t have counties. Instead, its political subdivisions are called parishes.",
        "Louisiana-made tabasco sauce holds the second oldest food trademark in the US patent office.",
        "Louisiana is one of the few US states that offers sales tax refunds to international visitors.",
        "Louisiana is the largest producer of alligators, crawfish and oysters in the country.",
        "Canal Street, one of New Orleans’ busiest streets, was named after a canal that was supposed to be built there. However, the waterway was never dug.",
        "The official beverage of Louisiana isn’t a Hurricane, Sazarec or any other signature alcoholic drink. It’s milk.",
        "Louisiana has its own French dialects, the most popular being Creole French. The dialect is mainly a mix of the original French spoken by settlers and Acadian French, but it also includes words of African, Spanish, Native American and English descent."
        ];
        var command = paramify(message);
        if ((command[0] === "Tell" || command[0] === "tell") &&
            command[1] === "me" &&
            command[2] === "something" &&
            command[3] === "fun" &&
            command[4] === "about" &&
            (command[5] === "louisiana" || command[5] === "louisiana?")) {
            var botMessage =  answers[Math.floor(Math.random() * answers.length)];
        }
        bot.sendMessage(message.channel, botMessage);
    }
    cb(null, 'waterBoy');
  };

  const virtualDom = (message, cb) => {
    if (validate(message)) {
      var command = paramify(message);
      console.log('The Virtual Dom!', command)
      if ( (command[0] === 'Tell' || command[0] === 'tell') && command[1] === 'me' && command[2] === 'about' && command[3] === 'the' && command[4] === 'virtual' && (command[5] === 'DOM.' || command[5] === 'dom.' ) ) {
        var botMessage =  'The Virtual Dominic Object Model is an important concept in React!'
      }
      bot.sendMessage(message.channel, botMessage);
    }
    cb(null, 'virtualDom');
  };

  const heart = (message, cb) => {
      if (validate(message)) {
        var command = paramify(message);
        console.log('heart!', command)
      if (command[0] === 'heart' ) {
        var botMessage =  ':heart:';
      }
      bot.sendMessage(message.channel, botMessage);
    }
    cb(null, 'heart');
  };

  return {
    quoteMachine,
    trainStatus,
    floorMessage,
    existentialCrisis,
    peterCrisis,
    areyouDone,
    favoriteThings,
    tellMeSomething,
    whatDoIKnow,
    doYouLike,
    thanks,
    howAwesome,
    wakeUp,
    theDom,
    waterBoy,
    virtualDom,
    heart,
  };

}; // module.exports
