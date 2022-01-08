const express = require('express'),
  morgan = require('morgan'),
  bodyParser =require('body-parser');
const app = express();

app.use(morgan('common'));

app.use(express.static('public'));

app.get('/movies', (req, res) => {
  res.send('Succesful GET request returning data of movies');
});

app.get('/', (req, res) => {
  res.send('Welcome to Movie api');
});

app.get('/movies/:title', (req, res) => {
  res.send('Succesful Get request returning data on a movie by title');
});

app.get('/genres/:title', (req, res) => {
  res.send('Succesful Get request returning data on a movie genre');
});

app.get('/directors/:name', (req, res) => {
  res.send('Succesful Get request returning data on a movie director');
});

app.post('/user/:newuser', (req, res) => {
  res.send('Succesful Post request adding new user info to the application');
});

app.put('/user/:username', (req, res) => {
  res.send('Succesful PUT request updating the users information');
});

app.post('/favourites', (req, res) => {
  res.send('Succesful Post request adding a movie to the users favourites');
});

app.delete('/favourites/:title', (req, res) => {
  res.send('Succesful Delete request removing specified movie from users favourites');
});

app.delete('/user/:username', (req, res) => {
  res.send('Succesful Delete request removing users data from the application');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  re.status(500).send('Something broke');
});

app.listen(8080, () => {
  console.log('Running on port 8080');
});
