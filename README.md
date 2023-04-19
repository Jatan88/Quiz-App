# Quiz App API

This is an implementation of a Quiz App API using Node.js and Express framework. It includes endpoints for creating a quiz, getting all quizzes, getting active quiz, and getting quiz result. It also includes a rate limiter and a cache to prevent abuse of the API and to store frequently accessed data, respectively.

The model includes the following packages:

- express for building web applications
- body-parser for parsing incoming request bodies
- moment for working with dates and times
- express-rate-limit for rate limiting API requests
- node-cache for caching frequently accessed data
The code defines an instance of the express application and sets up middleware to parse incoming request bodies as JSON. It also requires the dotenv and database configurations.

A rate limiter is created to prevent abuse of the API, and a cache is created to store frequently accessed data. The code defines a helper function updateQuizStatus to update the status of a quiz based on the current date and time.

The endpoints include:

- / - returns a welcome message
- /quizzes - The POST request for creating a quiz validates the request body and creates a new quiz object with the data provided. The quiz object is then saved to the   database., and GET request to get all quizzes from the database.
- /quizzes/active - The GET request for getting the active quiz first checks the cache for an active quiz, and if not found, fetches an active quiz from the database and stores it in the cache.
- /quizzes/:id/result - The GET request for getting quiz result fetches a quiz by ID, checks if the quiz is finished, and returns the right answer.


The model exports the app object to be used in the main program file.

# Postman Testing Video

https://drive.google.com/file/d/1bkqamwx0gJO6XiWg9FtW9E5Bq_YhEvKu/view?usp=sharing
