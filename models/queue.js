const { getDB } = require('../lib/dbConnect.js');

function getAllQueuedStudents() {
  console.log('inside get All students in queue mongodb');
  getDB() // connect to mongo DB
    .then( db => {
      db.student-q.find({}, (findErr, res) => {
        if(findErr) {
          console.log('error retrieving studentqueue');
          db.close();
        } else {
          console.log(res);
          db.close();
          return res;
        }
      })
    })
    .catch( err => {
      console.log('failed to connect to DB getAllQueuedStudents');
    })
}

function clearStudentQueue() {
  console.log('inside clear student queue mongodb');
  getDB()
    .then( db => {
      db.student-q.delete({}, (deleteErr, res) => {
        if(deleteErr) {
          console.log('error deleting queue');
          db.close();
        } else {
          console.log(res);
          db.close();
          return res;
        }
      })
    })
    .catch( err => {
      console.log('failed to connect to DB clearStudentQueue');
    });
}

function clearTAQueue(TAid) {
  console.log('inside clear TA queue mongodb', TAid);
  console.log('this still deletes all the queue');
  getDB()
    .then( db => {
      db.ta-q.delete({}, (deleteErr, res) => {
        if(deleteErr) {
          console.log('error deleting TA queue');
          db.close();
        } else {
          console.log(res);
          db.close();
          return res;
        }
      })
    })
    .catch( err => {
      console.log('failed to connect to DB clearTAQueue');
    });
}


module.exports = {
  getAllQueuedStudents,
  clearStudentQueue,
  clearTAQueue
}
