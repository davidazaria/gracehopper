const { getDB } = require('../lib/dbConnect.js');

function getAllQueuedStudents() {
  console.log('inside get All students in queue mongodb');
  getDB() // connect to mongo DB
    .then( db => {
      db.student-q.find({}, (findErr, res) => {
        if(findErr) {
          console.log('error retrieving studentqueue');
        } else {
          console.log(res);
          db.close();
          return res;
        }
      })
    })
    .catch( err => {
      console.log('failed to connect to DB');
    })
}

function clearStudentQueue() {
  console.log('inside clear student queue mongodb')
}

function clearTAQueue() {
  console.log('inside clear TA queue mongodb');
}


module.exports = {
  getAllQueuedStudents,
  clearStudentQueue,
  clearTAQueue
}
