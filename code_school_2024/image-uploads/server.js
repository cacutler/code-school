const express = require("express")
const multer = require("multer")
const model = require("./model")
require("dotenv").config()
const app = express()
const PORT = process.env.PORT || 3000
app.use(express.static("public"))
app.use(express.json({limit: "10mb"}))
const storage = multer.memoryStorage()
const upload = multer({storage: storage})
app.get("/posts", async (request, response) => {
    try {
        const posts = await model.Post.find()
        response.status(200).json(posts)
    } catch (error) {
        response.status(404).json("Error: " + error)
    }
})
app.post("/posts", upload.single("image"), async (request, response) => {
    const {title, content} = request.body
    const imageType = request.file.mimetype
    const imageBase64 = request.file.buffer.toString("base64")
    const newPost = new model.Post({title: title, content: content, image: imageBase64, imageType: imageType})
    try {
        const savedPost = await newPost.save()
        response.status(200).json(savedPost)
    } catch (error) {
        response.status(400).json("Error: " + error)
    }
})
app.listen(PORT, () => {
    console.log(`Server running: http://localhost:${PORT}`)
})