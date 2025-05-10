const express = require("express")
require("dotenv").config()
const session = require("express-session")
const cors = require("cors")
const model = require("./model")
const app = express()
app.use(express.json())
app.use(cors())
app.get("/servers", async (request, response) => {
    try {
        let servers = await model.Server.find().populate("members", "-password")
        response.json(servers)
    } catch (error) {
        console.log(error)
        response.status(500).send("Server error")
    }
})
app.post("/servers", async (request, response) => {
    try {
        let newServer = new model.Server({name: request.body.name, members: request.body.members})
        let error = newServer.validateSync()
        if (error) {
            return response.status(422).json(error.errors)
        }
        await newServer.populate("members", "name email username")
        await newServer.save()
        response.status(201).send("Server created")
    } catch (error) {
        console.log(error)
        response.status(500).send("Server error")
    }
})
app.put("/servers", async (request, response) => {
    try {
        let updatedServer = {name: request.body.name, members: request.body.members}
        let putServer = await model.Server.findByIdAndUpdate({_id: request.params.id}, updatedServer, {new: true})
        if (!putServer) {
            return response.status(404).send("Failed to update server")
        }
        response.status(204).send("Updated server")
    } catch (error) {
        console.log(error)
        response.status(500).send("Server error")
    }
})
app.get("/users", async (request, response) => {
    try {
        let users = await model.User.find({}, {password: 0})
        response.send(users)
    } catch (error) {
        console.log(error)
        response.status(500).send("Server error")
    }
})
app.post("/users", async (request, response) => {
    try {
        let newUser = await new model.User({email: request.body.email, name: request.body.name, username: request.body.username, account_age: request.body.account_age})
        await newUser.hashPassword(request.body.password)
        const error = await newUser.validateSync()
        if (error) {
            return response.status(422).send(error)
        }
        await newUser.save()
        response.status(201).send("You're a-okay")
    } catch (error) {
        console.log(error)
        response.status(500).send("Server error")
    }
})
app.listen(8080, function () {
    console.log("Server listening on http://localhost:8080...")
})