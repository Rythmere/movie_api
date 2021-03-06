### movie_api

### Description

Movie api is a server side component for a movies web pag that allows a user to sign-up, access information about movies (genre, director, synopsis) and add movies to their favourites

### Essential Features

    Return a list of all movies to the user
    Return data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title to the user
    Return data about a genre (description) by name/title (e.g., “Thriller”)
    Return data about a director (bio, birthdate) by name
    Allow new users to register
    Allow users to update their user info (username, password, email, date of birth)
    Allow users to add a movie to their list of favorites
    Allow users to remove a movie from their list of favorites
    Allow existing users to deregister

### Technical Requirements

    The API must be a Node.js and Express application.
    The API must use REST architecture, with URL endpoints corresponding to the data operations listed above
    The API must use at least three middleware modules, such as the body-parser package for reading data from requests and morgan for logging.
    The API must use a “package.json” file.
    The database must be built using MongoDB.
    The business logic must be modeled with Mongoose.
    The API must provide movie information in JSON format.
    The JavaScript code must be error-free.
    The API must be tested in Postman.
    The API must include user authentication and authorization code.
    The API must include data validation logic.
    The API must meet data security regulations.
    The API source code must be deployed to a publicly accessible platform like GitHub.
    The API must be deployed to Heroku.

### Endpoints

- /
- /login
- /users
- /users/[Username]
- /users/[Username]/movies
- /users/[Username]/movies/[MovieID]
- /movies
- /movies/[Title]
- /genres/[Name]
- /directors/[Name]

### Dependencies

   - "bcrypt": "^5.0.1",
   - "body-parser": "^1.19.0",
   - "cors": "^2.8.5",
   - "express": "^4.17.1",
   - "express-validator": "^6.14.0",
   - "jsonwebtoken": "^8.5.1",
   - "mongoose": "^6.1.7",
   - "morgan": "^1.10.0",
   - "passport": "^0.5.2",
   - "passport-jwt": "^4.0.0",
   - "passport-local": "^1.0.0"

### Tecnologies:

- Node
- Express
- MongoDB
- Mongoose

**To run app**
`npm start`