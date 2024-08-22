const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

// Declare for project
let bodyParser = require('body-parser');
let UserModel = require('./src/models/user');

app.use(bodyParser.urlencoded({ extended: false }));
let users = [];
let exercises = [];
// Declare for project

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// Start building project here
app.post("/api/users", function (req, res) {
  let userModel = new UserModel({ username: req.body.username });
  let userData = { username: userModel.username, _id: userModel._id.toString() };
  users.push(userData);
  res.json(userData);
});

app.get("/api/users", function (req, res) {
  res.json(users);
});

app.post("/api/users/:_id/exercises", function (req, res) {
  let id = req.params._id;
  let exercise = {};

  let user = users.find(user => user._id === id);
  if (user !== undefined) {
    exercise.username = user.username;
  } else {
    exercise.username = "Not found";
  }
  exercise.description = req.body.description;
  exercise.duration = Number(req.body.duration);
  exercise.date =
    (req.body.date !== undefined && req.body.date !== "")
      ? new Date(req.body.date).toDateString()
      : (new Date()).toDateString();
  exercise._id = id;
  exercises.push(exercise);
  res.json(exercise);
});

app.get("/api/users/:_id/logs", function (req, res) {
  let id = req.params._id;
  let log = {};

  let user = users.find(user => user._id === id);
  if (user !== undefined) {
    log.username = user.username;

    let exerciseLog = [];
    exercises.forEach(exercise => {
      if (exercise._id === id) {
        exerciseLog.push({
          description: exercise.description,
          duration: exercise.duration,
          date: exercise.date
        });
      }
    });
    log.count = exerciseLog.length;

    let limitedExerciseLog = [];
    let from =
      (req.query.from !== undefined)
        ? (new Date(req.query.from)).getTime()
        : 0
    let to =
      (req.query.to !== undefined)
        ? (new Date(req.query.to)).getTime()
        : (new Date()).getTime()
    let limit =
      (req.query.limit !== undefined)
        ? Number(req.query.limit)
        : exercises.length
    exerciseLog.forEach(exercise => {
      let exerciseTime = (new Date(exercise.date)).getTime();
      if (
        exerciseTime >= from
        &&
        exerciseTime <= to
        &&
        limitedExerciseLog.length < limit
      ) {
        limitedExerciseLog.push(exercise);
      }
    });

    log._id = id;
    log.log = limitedExerciseLog;
    res.json(log);
  } else {
    console.log(`_id ${id} is not found.`);
  }
});
// End building project here

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
