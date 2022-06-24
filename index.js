const express = require('express'),
  morgan = require('morgan'),
  bodyParser =require('body-parser'),
  mongoose =require('mongoose'),
  models =require('./models.js'),
  { check, validationResult} = require('express-validator');


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const cors = require('cors');
app.use(cors());
let auth = require('./auth')(app);

const passport =require('passport');
require('./passport');
const Movies = models.Movie;
const Users = models.User;

// Connects to MongoDb
mongoose.connect(process.env.Connection_URL, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(morgan('common'));

app.use(express.static('public'));

/**
 * @method get
 * Returns a list of all movies
 * Request body: Bearer token
 * @returns array of movies objects
 * @requires passport
 */
app.get('/movies', passport.authenticate('jwt', {session: false}), (req, res) => {
  Movies.find().then((movie) => {
    res.json(movie);
  })
  .catch((err)=> {
    console.error(err);
    res.status(500).send('Error' + err);
  });
});

/**
 * @method get
 * Returns welcome message for '/' request URL
 * @returns Welcome message
 */
app.get('/', (req, res) => {
  res.send('Welcome to Movie api');
});

/**
 * @method get
 * Returns data for a single movie (description, genre, director, image URL, whether it’s featured or not)
 * Request body: Bearer token
 * @param Movie title
 * @returns movie object
 * @requires passport
 */
app.get('/movies/:title', passport.authenticate('jwt', {session: false}), (req, res) => {
  Movies.findOne({Title: req.params.title}).then((movie) => {
    res.json(movie);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error' + err);
  });
});

/**
 * @method get
 * Returns data about a genre (description)
 * Request body: Bearer token
 * @param  Genre name
 * @returns genre object
 * @requires passport
 */
app.get('/genres/:name', passport.authenticate('jwt', {session: false}), (req, res) => {
  Movies.findOne({"Genre.Name": req.params.name}).then((movie)=>{
    res.json(movie.Genre);
  })
  .catch((err)=>{
    console.error(err);
    res.status(500).send('Error' + err);
  });
});

/**
 * @method get
 * Returns data about a Director (Bio, and birthyear)
 * Request body: Bearer token
 * @param Director name
 * @returns Director object
 * @requires passport
 */
app.get('/directors/:name', passport.authenticate('jwt', {session: false}), (req, res) => {
  Movies.findOne({"Director.Name": req.params.name}).then((movie)=>{
    res.json(movie.Director);
  })
  .catch((err)=>{
    console.error(err);
    res.status(500).send('Error' + err);
  });
});

/**
 * @method get
 * Returns data on a single user (username, email, password, and birthday) 
 * Request body: Bearer token
 * @param Username
 * @returns user object
 * @requires passport
 */
app.get('/users/:Username', passport.authenticate('jwt', {session: false}), (req, res)=> {
  Users.findOne({ Username: req.params.Username}).then((user)=> {
    res.json(user);
  }).catch((err)=> {
    console.error(err);
    res.status(500).send('Error'+ err);
  })
});

/**
 * @method post
 * Registers a new user and adds there acount info to the database.  Username, Password & Email are required fields.
 * Request body: JSON with user information
 * @returns user object
 */
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

/**
 * @method put
 * Allow users to update their account and returns new user object (Username, email, password, and birthday are required even if they are not being changed)
 * Request body: Bearer token, updated user info
 * @param Username
 * @returns updated user object
 * @requires passport
 */
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

/**
 * @method post
 * Adds a movie to a users list of favourites
 * Request body: Bearer token
 * @param username
 * @param movieId
 * @returns updated user object
 * @requires passport
 */
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

/**
 * @method delete
 * Removes a movie from a users list of favourites
 * Request body: Bearer token
 * @param username
 * @param movieId
 * @returns updated user object
 * @requires passport
 */
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

/**
 * @method get
 * Returns a users list of favourite movies
 * Request body: Bearer token
 * @param Username
 * @returns array of favourite movies (movieId)
 * @requires passport
 */
app.get('/users/:Username/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      if (user) {
        res.status(200).json(user.Favourites);
      } else {
        res.status(400).send('Could not find favorite movies for this user');
      };
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * @method get
 * Allows existing users to deregister
 * Request body: Bearer token
 * @param Username
 * @returns success message
 * @requires passport
 */
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
