
# Voting Application

This is a web-based voting application that allows an admin to manage candidates and users to register and vote for their preferred candidates. The application supports real-time updates of the vote counts.


## Technologies Used

[Nodejs](https://nodejs.org/en)                                  
[Express](https://expressjs.com/)          
[MongoDB](https://www.mongodb.com/try/download/community)



## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`MONGODB_URL`

`JWT_SECRET`

`PORT`


## Features

- Admin can Add Candidates
- Only Users can Vote
- Authentication features Added
- Admin can Check the no. of votes received
- User's can Authenticate using Token




## Installation

Install Node modules with NPM

```bash
  npm install
```
To Start the server run the below command

```bash
  nodemon server.js
```


## API Reference

#### User SignUp

```http
  POST http://localhost:3000/user/signUp
```
#### Required fields to SignUp

```http
  {
    "name": "xyz",
    "age": 18,
    "mobile": 1234567890,
    "email": "xyz@gmail.com@gmail.com",
    "address": "Basra kazi ,
    "aadharCardNumber": 123456789012,
    "password": "123456"
}
```

#### Candidate SignUp

```http
  POST http://localhost:3000/candidate/signup
```
#### Required fields to SignUp

```http
{
    "name": "Kejriwal",
    "age": 45,
    "party": "AAP"
}
```

#### Candidate Update

```http
  PUT http://localhost:3000/candidate/(candidate ID from DB)6690fea60a65873cead7eb4d
```
### And Also pass the admin Token in Authorization as bearer Token to edit any candidate data
#### Required fields to SignUp

```http
{
    "name": " Arvindd Kejriwal",
    "age": 50,
    "party": "BJP"
}
```

#### Delete Candidate

```http
  DELETE http://localhost:3000/candidate/(CANDIDATE id)6690fea60a65873cead7eb4d
```
### And Also pass the admin Token in Authorization as bearer Token to DELETE any candidate data

#### Check the vote count

```http
  GET http://localhost:3000/candidate/vote/count
```


#### To Vote

```http
  http://localhost:3000/candidate/vote/(candidate ID)6690fcb42d4224f67fce4c68
```
### And Also pass the user Token in Authorization as bearer Token to Vote to any candidate.


#### To get the List of candidates

```http
  http://localhost:3000/candidate/candidateList
```





## Authors

- [@rahulSansarey(https://github.com/rahulSansarey)

