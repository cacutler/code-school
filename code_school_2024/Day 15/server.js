const http = require("http")
const queryString = require("querystring")
const server = http.createServer()
let legal_songs = [{name: "Buddy Holly", length: 600}]
server.on("request", (request, response) => {
    if (request.url !== "/legal-songs") {
        response.statusCode = 404
        response.write("Whatever you are looking for, it's not here.")
        response.end()
        return
    }
    switch(request.method) {
        case "GET":
            response.statusCode = 200
            response.setHeader("Content-Type", "application/json")
            response.write(JSON.stringify(legal_songs))
            response.end()
            break
        case "POST":
            response.statusCode = 201
            let chunks = []
            response.on("data", (chunk) => {
                chunks += chunk.toString()
            })
            request.on("end", () => {
                let parsedData = queryString.parse(chunks)
                legal_songs.push(parsedData)
                response.statusCode = 201
                response.write("Created.")
                response.end()
            })
            break
        default:
            response.statusCode = 404
            response.write("Not a valid method for legal-songs.")
            response.end()
            break
    }
})
server.listen(8080, () => {
    console.log("Server is running on http://localhost:8080")
})