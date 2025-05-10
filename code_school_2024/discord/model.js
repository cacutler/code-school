const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const {Schema} = mongoose
require("dotenv").config()
mongoose.connect(process.env.DATABASE)
const ServerSchema = Schema({name: {type: String, required: [true, "Server must have a name."]}, members: [{type: Schema.Types.ObjectId, ref: "UserDiscord"}]})
const UserSchema = Schema({email: {type: String, required: [true, "User must have an email."]}, name: {type: String, required: [true, "User must have a name."]}, password: {type: String, required: [true, "User must have a password."]}, username: {type: String, required: [true, "User must have a username."]}, account_age: {type: Number}})
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
const Server = mongoose.model("Server", ServerSchema)
const User = mongoose.model("UserDiscord", UserSchema)
module.exports = {Server: Server, User: User}