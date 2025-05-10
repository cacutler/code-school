const express = require("express")
const app = express()
app.use(express.urlencoded({extended: true}))
let legal_songs = [{name: "Everyday", length: 220}]
app.get("/legal-songs", (request, response) => {
    response.setHeader("Access-Control-Allow-Origin", "*")
    response.json(legal_songs)
})
app.post("/legal-songs", (request, response) => {
    legal_songs.push({name: request.body.name, length: parseInt(request.body.length)})
    response.setHeader("Access-Control-Allow-Origin", "*")
    response.status(201).send("Created legal song.")
})
app.listen(8080, () => {
    console.log("Serve is running on http://localhost:8080")
})