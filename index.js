// implement your API here
const express = require("express")

const userModel = require("./data/db")

const server = express()

// middleware
// teach express how to read JSON from the request body
server.use(express.json()) // need for POST/PUT requests

// GET all users
server.get("/api/users", (req, res) => {
  // send the list of users back to the client
  userModel
    .find()
    .then(users => {
      res.json(users)
    })
    .catch(res => {
      res
        .status(500)
        .json({ error: "The users information could not be retrieved" })
    })
})

// GET user by ID
server.get("/api/users/:id", (req, res) => {
  // get the id from the request
  const id = req.params.id

  userModel
    .findById(id)
    .then(user => {
      if (!user) {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist" })
      } else {
        res.json(user)
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The user information could not be retrieved" })
    })
})

// POST new user
server.post("/api/users", (req, res) => {
  const userData = req.body

  if (!userData.name || !userData.bio) {
    res
      .status(400)
      .json({ errorMessage: "please provide a name and bio for the user" })
  } else {
    userModel
      .insert(userData)
      .then(user => {
        userModel
          .findById(user.id)
          .then(newUser => {
            res.json(newUser)
          })
          .catch(err => {
            res.status(500).json({
              error: "There was an error while saving the user to the database"
            })
          })
      })
      .catch(err => {
        res.status(500).json({
          error: "There was an error while saving the user to the database"
        })
      })
  }
})

// PUT to update User by ID
server.put("/api/users/:id", (req, res) => {
  const id = req.params.id
  const changes = req.body

  if (!changes.name || !changes.bio) {
    res
      .status(400)
      .json({ errorMessage: "Please provide a name and bio for the user" })
  } else {
    userModel
      .update(id, changes)
      .then(() => {
        userModel
          .findById(id)
          .then(user => {
            res.status(200).json(user)
          })
          .catch(err => {
            res.status(404).json({
              message: "The user with the specified ID does not exist"
            })
          })
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: "The user information could not be modified" })
      })
  }
})

// DELETE user by ID
server.delete("/api/users/:id", (req, res) => {
  // get id from request parameters
  const id = req.params.id

  // remove user by id
  userModel
    .remove(id)
    .then(user => {
      // if user with id is not found, return 404
      if (!user) {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist" })
      } else {
        res.status(200).json({ message: "User has been removed" })
      }
    })
    .catch(err => {
      res.status(500).json({ error: "The user could not be removed" })
    })
})

const port = 8000

server.listen(port, () => console.log(`app is running on port:${port}`))
