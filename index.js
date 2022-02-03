const express = require('express'),
  morgan = require('morgan'),
  bodyParser =require('body-parser'),
  mongoose =require('mongoose'),
  models =require('./models.js'),
  { check, validationResult} = require('express-validator');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
let auth = require('./auth')(app);

const cors = require('cors');
app.use(cors());
const passport =require('passport');
require('./passport');
const Movies = models.Movie;
const Users = models.User;

mongoose.connect(process.env.Connection_URL, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(morgan('common'));

app.use(express.static('public'));

app.get('/movies' /*, passport.authenticate('jwt', {session: false})*/, (req, res) => {
  Movies.find().then((movie) => {
    res.json(movie);
  })
  .catch((err)=> {
    console.error(err);
    res.status(500).send('Error' + err);
  });
});

app.get('/', (req, res) => {
  res.send('Welcome to Movie api');
});

app.get('/movies/:title', passport.authenticate('jwt', {session: false}), (req, res) => {
  Movies.findOne({Title: req.params.title}).then((movie) => {
    res.json(movie);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error' + err);
  });
});

app.get('/genres/:name', passport.authenticate('jwt', {session: false}), (req, res) => {
  Movies.findOne({"Genre.Name": req.params.name}).then((movie)=>{
    res.json(movie.Genre);
  })
  .catch((err)=>{
    console.error(err);
    res.status(500).send('Error' + err);
  });
});

app.get('/directors/:name', passport.authenticate('jwt', {session: false}), (req, res) => {
  Movies.findOne({"Director.Name": req.params.name}).then((movie)=>{
    res.json(movie.Director);
  })
  .catch((err)=>{
    console.error(err);
    res.status(500).send('Error' + err);
  });
});

app.post('/users', [
  check('Username', 'Username is required').not().isEmpty(),
  check('Username', 'Username contains non alphanumeric characters').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email is not valid').isEmail()
], (req, res) => {
  let errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }
  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + ' Already exists');
      } else {
        Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).json(user) })
        .catch((err) => {
          console.error(err);
          res.status(500).send('Error: ' + err);
        })
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

app.put('/users/:Username', passport.authenticate('jwt', {session: false}), [
  check('Username', 'Username is required').not().isEmpty(),
  check('Username', 'Username contains non alphanumeric characters').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email is not valid').isEmail()
], (req, res) => {
  let errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }
  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username,
      Password: hashedPassword,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true },
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
     $push: { Favourites: req.params.MovieID }
   },
   { new: true },
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
     $pull: { Favourites: req.params.MovieID }
   },
   { new: true },
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

app.delete('/users/:username', passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.findOneAndRemove({Username: req.params.username}).then((user)=>{
    if(!user) {
      res.status(400).send(req.params.username + 'was not found');
    } else {
      res.status(200).send(req.params.username + 'was deleted');
    }
  }).catch((err)=> {
    console.error(err);
    res.status(500).send('Error'+ err);
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  re.status(500).send('Something broke');
});

const port = process.env.PORT || 8080
app.listen(port, '0.0.0.0',() => {
  console.log('Running on port ' + port);
});
