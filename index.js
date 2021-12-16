const express = require('express'),
  morgan = require('morgan');
const app = express();

let topMovies = [
  {
    title: 'Your Name',
    year: '2016'
  },
  {
    title: 'A Silent Voice',
    year: '2016'
  },
  {
    title: 'Sword Art Online The Movie: Ordinal Scale',
    year: '2017'
  },
  {
    title: 'Sword Art Online Progressive: Aria of a Starless Night',
    year: '2021'
  },
  {
    title: 'My Hero Academia: Two Heroes',
    year: '2018'
  },
  {
    title: 'My Hero Academia: Two Heroes',
    year: '2019'
  },
  {
    title: 'My Hero Academia: World Heroes\' Mission',
    year: '2021'
  },
  {
    title: 'Dragon Ball Super: Broly',
    year: '2018'
  },
  {
    title: 'Anohana: The Flower We Saw That Day - The Movie',
    year: '2013'
  },
  {
    title: 'KonoSuba: God\'s Blessing on this Wonderful World! Legend of Crimson',
    year: '2019'
  }
];

app.use(morgan('common'));

app.use(express.static('public'));

app.get('/movies', (req, res) => {
  res.json(topMovies);
});

app.get('/', (req, res) => {
  res.send('Movies');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  re.status(500).send('Something broke');
});

app.listen(8080, () => {
  console.log('Running on port 8080');
});
