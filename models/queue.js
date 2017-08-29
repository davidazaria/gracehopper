// const { getDB } = require('../lib/dbConnect.js');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = process.env.MONGODB_URI || 'mongodb://localhost:27017/gracehopper';

var prettyQueue = function(arr, type) {
  var queueArray = arr.map(function(user) {
    return user.profile.real_name;
  });
  if(type == 'queue') {
    return "*MONGO queue now:* \n" + (queueArray.length ? queueArray.join(",\n") : "empty 🌑");
  } else if(type == 'tas') {
    return "*MONGO tas now:* \n" + (queueArray.length ? queueArray.join(",\n") : "empty 🌑");queueArray;
  }
};

function getQueue(bot, message) {
  console.log('inside getStudents mongodb');
  // MongoClient.connect(url, function(err, db) {
  MongoClient.connect(url, (err, db) => {
    assert.equal(null, err);
    let qResult = [];
    // console.log('passed the assert');
    let students = db.collection('students').find();

    // console.log('students ->', students);
    students.forEach( (doc,err) => {
      assert.equal(null, err);
      qResult.push(doc);
    }, function() { // for each takes to callbacks, second one runs after all items are iterated

      // how do we return this stuff?
      // if(qResult.length > 0) { // result could be empty
      bot.sendMessage(message.channel, prettyQueue(qResult, 'queue'));
      // }
      db.close();
    })
  })
}

const asyncGetQueue = async (bot, message) => {
  console.log('inside getStudents mongodb');
  // MongoClient.connect(url, function(err, db) {
  await MongoClient.connect(url, (err, db) => {
    assert.equal(null, err);
    let qResult = [];
    // console.log('passed the assert');
    let students = db.collection('students').find();

    // console.log('students ->', students);
    students.forEach( (doc,err) => {
      assert.equal(null, err);
      qResult.push(doc);
    }, function() { // for each takes to callbacks, second one runs after all items are iterated

      // how do we return this stuff?
      // if(qResult.length > 0) { // result could be empty
      // bot.sendMessage(message.channel, prettyQueue(qResult, 'queue'));
      // }
      db.close();
    });
    return qResult;
  }) // end of MongoClient Connection
}

function getTAs(bot, message) {
  console.log('inside getTAs');
  MongoClient.connect(url, (err, db) => {
    assert.equal(null, err);
    let resultTas = [];
    let tas = db.collection('tas').find();
    tas.forEach((ta,err) => {
      assert.equal(null, err);
      resultTas.push(ta);
    }, function() { // call back called after foreach is done
      console.log('the result of the TA mongo call ->', resultTas);
      // if(resultTas.length > 0) { // result could be empty
      bot.sendMessage(message.channel, prettyQueue(resultTas, 'tas'));

      // }
      db.close();
    })
  })
}

function addToQueue(bot, message, studentInfo) {
  console.log('inisde addToQ', studentInfo);
  MongoClient.connect(url, (err, db) => {
    assert.equal(null, err);
    db.collection('students').insertOne(studentInfo, (err, res) => {
      assert.equal(null, err);
      console.log('item inserted -> ', res);
      bot.sendMessage(message.channel, 'correctly inserted into Mongo');
      db.close();
    });
  })
}

function addToTAQueue(bot, message, taInfo) {
  console.log('inisde addTo TA Queue', taInfo);
  MongoClient.connect(url, (err, db) => {
    assert.equal(null, err);
    db.collection('tas').insertOne(taInfo, (err, res) => {
      assert.equal(null, err);
      console.log('item inserted -> ', res);
      bot.sendMessage(message.channel, 'TA correctly inserted into Mongo');
      db.close();
    });
  })
}

function removeFromQueue(bot, message, studentInfo) {
  console.log('inside removefromQueue', studentInfo);
  // for the student case of this part remove from queue is basically
  // get the first person in the queue
}

function removeFromTAQueue(bot, message, taInfo) {
  console.log('inside removeFromTAQueue');

}

function clearQueue(bot, message, currentTA) {
  console.log('inside clear queue', );
  MongoClient.connect(url, (err, db) => {
    db.collection('students').deleteMany({});
    db.close();
    bot.sendMessage(message.channel, `MONGO: Queue cleared, ${currentTA.name} have a :tropical_drink:`);
  })
}

function clearTAQueue(bot, message, currentTA) {
  console.log('inside clear queue', );
  MongoClient.connect(url, (err, db) => {
    db.collection('tas').deleteMany({});
    db.close();
    bot.sendMessage(message.channel, `MONGO: TAQueue cleared, ${currentTA.name} have a :rice_ball:`);
  })
}

function getFirstStudent() {
  console.log('inside getOnestudent in queue mongodb');
  MongoClient.connect(url, (err, db) => {
    // console.log('got the DB');
    let result = [];
    assert.equal(null, err);
    // console.log('passed the assert');
    // let students = db.collection('students').find().sort({_id:1}).limit(1);
    let students = db.collection('students').findOneAndDelete(); // when you don't specify order in find or findOne it will give natural order of insertion :)
    // this should be later on db.collection.findOneAndDelete
    // console.log('students ->', students);
    students.forEach( (doc,err) => {
      assert.equal(null, err);
      result.push(doc);
      // for each takes to callbacks, second one runs after all items are iterated
    }, function() {
      // close db here
      db.close();
      console.log(result);
      // how do we return this stuff?
      if(result) {
        console.log('theres a result longer than 0 -> ', result)
        bot.sendMessage(message.channel, `Up Next ->`);
        // bot.sendMessage(message.channel, result[0].name)
      }

    })
  })
}


module.exports = {
  removeFromQueue,
  getFirstStudent,
  addToQueue,
  clearQueue,
  clearTAQueue,
  getQueue,
  getTAs,
  addToTAQueue
}
