const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
require("dotenv").config()
mongoose.connect(process.env.DATABASE)
const QuizSchema = new mongoose.Schema({title: {type: String, required: [true, "Quiz must have a title."]}, owner: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: [true, "Quiz must have an owner."]}, description: {type: String, required: [true, "Quiz must have a description."]}, questions: [{questionText: {type: String, required: [true, "Question must have text."]}, possibleChoices: [{answerText: {type: String, required: [true, "Answer must have text."]}, isCorrect: {type: Boolean, required: [true, "Answer must either be correct or incorrect."]}}]}]})
const UserSchema = new mongoose.Schema({name: String, email: {type: String, required: [true, "User must have an email."]}, password: {type: String, required: [true, "User must have an email."]}})
UserSchema.methods.hashPassword = async function (password) {
    try {
        let hashedPassword = await bcrypt.hash(password, 12)
        this.password = hashedPassword
    } catch (error) {
        console.log(error)
    }
}
UserSchema.methods.verifyPassword = async function (password) {
    try {
        let isGood = await bcrypt.compare(password, this.password)
        return isGood
    } catch (error) {
        console.log(error)
    }
}
const User = mongoose.model("User", UserSchema)
const Quiz = mongoose.model("Quiz", QuizSchema)
module.exports = {Quiz: Quiz, User: User}