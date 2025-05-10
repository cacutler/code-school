const express = require("express")
const cors = require("cors")
const session = require("express-session")
const model = require("./model")
require("dotenv").config()
const app = express()
app.use(express.json())
app.use(express.static("public"))
app.use(cors({credentials: true, origin: function (origin, callback) {
    callback(null, origin)
}}))
app.use(session({secret: "jdkaokedkewndskkncdsnfkdeanfkendkfnjdksnafjkewnfaljkhfejakn", saveUninitialized: true, resave: false}))
async function AuthMiddleware(request, response, next) {
    if (request.session && request.session.userID) {
        let user = await model.User.findOne({_id: request.session.userID})
        if (!user) {
            return response.status(401).send("Unauthenticated.")
        }
        request.user = user
        next()
    } else {
        return response.status(401).send("Unauthenticated.")
    }
}
app.get("/users", async function (request, response) {
    try {
        let users = await model.User.find();
        response.send(users);
    } catch (error) {
        response.status(404).send("Users not found.");
    }
})
app.post("/users", async function (request, response) {
    try {
        let newUser = new model.User({name: request.body.name, email: request.body.email})
        await newUser.hashPassword(request.body.password)
        const error = await newUser.validateSync()
        if (error) {
            console.log(error)
            return response.status(422).send(error)
        }
        await newUser.save()
        response.status(201).send("New user created.")
    } catch (error) {
        response.status(500).send("Server error.")
    }
})
app.post("/session", async (request, response) => {
    try {
        let user = await model.User.findOne({email: request.body.email})
        if (!user) {
            return response.status(401).send("Authentication failure.")
        }
        let isGoodPassword = await user.verifyPassword(request.body.password)
        if (!isGoodPassword) {
            return response.status(401).send("Authentication failure.")
        }
        request.session.userID = user._id
        request.session.name = user.name
        response.status(201).send(request.session)
    } catch (error) {
        console.log(error)
        return response.status(500).send("Server error.")
    }
})
app.get("/quizzes", async function (request, response) {
    try {
        let quizzes = await model.Quiz.find().populate("owner", "-password")
        if (!quizzes) {
            return response.status(404).send("Quizzes not found.")
        }
        response.json(quizzes)
    } catch (error) {
        console.log(error)
        response.status(404).send("Quizzes not found.")
    }
})
app.get("/quizzes/:quizId", async function (request, response) {
    try {
        let quiz = await model.Quiz.findOne({_id: request.params.quizId})
        if (!quiz) {
            console.log("Quiz not found.")
            return response.status(404).send("Quiz not found.")
        }
        if (quiz.owner._id.toString() !== request.session.userID.toString()) {
            return response.status(404).send("Unauthenticated.")
        }
        response.json(quiz)
    } catch (error) {
        console.log(error)
        console.log("Bad request (GET quiz).")
        return response.status(400).send("Quiz not found.")
    }
})
app.post("/quizzes", async (request, response) => {
    try {
        let newQuiz = new model.Quiz({title: request.body.title, owner: request.session.userID, description: request.body.description, questions: request.body.questions})
        let error = newQuiz.validateSync()
        if (error) {
            return response.status(422).json(error.errors)
        }
        await newQuiz.populate("owner", "name email")
        await newQuiz.save()
        response.status(201).send("Quiz created.")
    } catch (error) {
        console.log(error)
        return response.status(400).send("Quiz cannot be created.")
    }
})
app.get("/session", AuthMiddleware, async (request, response) => {
    console.log(request.user)
    response.send(request.session)
})
app.put("/quizzes/:quizId", AuthMiddleware, async (request, response) => {
    try {
        let quiz = await model.Quiz.findOne({_id: request.params.quizId, owner: request.user._id}).populate("owner")
        if (!quiz) {
            return response.status(404).send("Quiz not found")
        }
        if (request.user._id.toString() !== quiz.owner._id.toString()) {
            return response.status(403).send("Not Authenticated")
        }
        quiz.title = request.body.title
        quiz.description = request.body.description
        quiz.questions = request.body.questions
        const error = await quiz.validateSync()
        if (error) {
            console.log(error)
            return response.status(422).send(error)
        }
        await quiz.save()
        response.status(204).send()
    } catch (error) {
        console.log(error)
        return response.status(400).send("Quiz cannot be updated.")
    }
})
app.delete("/quizzes/:quizId", AuthMiddleware, async function (request, response) {
    try {
        let isDeleted = await model.Quiz.findOneAndDelete({_id: request.params.quizId, owner: request.session.userID})
        if (!isDeleted) {
            return response.status(404).send("Quiz Not Found")
        }
        response.status(204).send("Removed")
    } catch (error) {
        console.log(error)
        return response.status(500).send(error)
    }
})
app.delete("/session", function (request, response) {
    request.session.userID = undefined
    request.session.name = undefined
    response.status(204).send()
})
app.listen(8080, function () {
    console.log("Server is running on http://localhost:8080.")
})