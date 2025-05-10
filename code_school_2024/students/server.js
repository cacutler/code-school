const express = require("express")
const app = express()
const model = require("./model")
app.use(express.urlencoded({extended: true}))
app.get("/students", async (request, response) => {
    let students = await model.Student.find()
    response.setHeader("Access-Control-Allow-Origin", "*")
    response.json(students)
})
app.post("/students", (request, response) => {
    let newStudent = new model.Student({name: request.body.name, major: request.body.major})
    newStudent.save().then(() => {
        response.setHeader("Access-Control-Allow-Origin", "*")
        response.status(201).send("Created student.")
    }).catch(() => {
        response.status(400).send("Something failed when making a student.")
    })
})
app.delete("/students/:id", (request, response) => {
    model.Student.findOneAndDelete({_id: request.params.id}).then((student) => {
        if (student) {
            response.status(200).send("Student removed.")
        } else {
            response.status(404).send("Student not found.")
        }
    }).catch(() => {
        response.status(400).send("Student not found.")
    })
})
app.get("/students/:id", (request, response) => {
    model.Student.findOne({_id: request.params.id}).then((student) => {
        if (student) {
            response.setHeader("Access-Control-Allow-Origin", "*")
            response.json(student)
        } else {
            response.status(404).send("Student not found.")
        }
    }).catch(() => {
        response.status(400).send("Student not found.")
    })
})
app.put("/students/:id", (request, response) => {
    let updatedStudent = {name: request.body.name, major: request.body.major}
    model.Student.findByIdAndUpdate({_id: request.params.id}, updatedStudent, {new: true}).then((student) => {
        if (student) {
            response.status(204).send("Student updated.")
        } else {
            response.status(404).send("Student is not found.")
        }
    }).catch(() => {
        response.status(400).send("Student is not found.")
    })
})
app.listen(8080, () => {
    console.log("Server is running on http://localhost:8080.")
})