const mongoose = require("mongoose")
require("dotenv").config()
mongoose.connect(process.env.DBURL)
const PostSchema = new mongoose.Schema({title: String, content: String, image: String, imageType: String})
const Post = mongoose.model("Post", PostSchema)
module.exports = {Post: Post}