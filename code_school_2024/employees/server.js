const express = require("express")
const cors = require("cors")
const session = require("express-session")
const model = require("./model")
require("dotenv").config()
const app = express()
app.use(express.json())
app.use(cors({credentials: true, origin: function (origin, callback) {
    callback(null, origin)
}}))
app.use(session({secret: "nmakndkiwnewnifhihdihwjiswhifqh", saveUninitialized: true, resave: false}))
app.get("/companies", async (request, response) => {
    try {
        let companies = await model.Company.find().populate("employees")
        response.json(companies)
    } catch (error) {
        console.log(error)
        response.status(500).send("Server error")
    }
})
app.get("/employees", async (request, response) => {
    try {
        let employees = await model.Employee.find()
        response.send(employees)
    } catch (error) {
        console.log(error)
        response.status(500).send("Server error")
    }
})
app.post("/companies", async (request, response) => {
    try {
        let newCompany = new model.Company({name: request.body.name, employees: request.body.employees, owner: request.body.owner})
        let error = newCompany.validateSync()
        if (error) {
            return response.status(422).json(error.errors)
        }
        await newCompany.populate("employees owner", "email name jobTitle pay")
        await newCompany.save()
        response.status(201).send("Company created.")
    } catch (error) {
        console.log(error)
        response.status(500).send("Server error")
    }
})
app.post("/employees", async (request, response) => {
    try {
        let newEmployee = await new model.Employee({email: request.body.email, name: request.body.name, jobTitle: request.body.jobTitle, pay: parseFloat(request.body.pay)})
        const error = await newEmployee.validateSync()
        if (error) {
            return response.status(422).send(error)
        }
        await newEmployee.save()
        response.status(201).send("New employee created.")
    } catch (error) {
        console.log(error)
        response.status(500).send("Server error")
    }
})
app.put("/employees/:id", async (request, response) => {
    try {
        let updatedEmployee = {email: request.body.email, name: request.body.name, jobTitle: request.body.jobTitle, pay: parseFloat(request.body.pay)}
        model.Company.findByIdAndUpdate({_id: request.params.id}, updatedEmployee, {new: true}).then((employee) => {
            if (employee) {
                response.status(204).send("Employee updated.")
            } else {
                response.status(404).send("Employee is not found.")
            }
        }).catch(() => {
            response.status(400).send("Student is not found.")
        })
    } catch (error) {
        console.log(error)
        response.status(500).send("Server error")
    }
})
app.listen(8080, function () {
    console.log("Server running on http://localhost:8080.")
})