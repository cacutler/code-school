const express = require("express")
const app = express()
const model = require("./model")
const cors = require("cors")
app.use(cors())
app.use(express.urlencoded({extended: true}))
app.get("/expenses", async (request, response) => {
    try {
        let expenses = await model.Expense.find()
        response.json(expenses)
    } catch (error) {
        console.log(error)
        response.status(400).send("Generic Error.")
    }
})
app.post("/expenses", async (request, response) => {
    try {
        let newExpense = new model.Expense({category: request.body.category, amount: parseInt(request.body.amount), description: request.body.description})
        let error = newExpense.validateSync()
        if (error) {
            response.status(400).json(error)
            return
        }
        await newExpense.save()
        response.status(201).json(newExpense)
    } catch (error) {
        console.log(error)
        response.status(400).send("Generic Error.")
    }
})
app.get("/expenses/:id", async (request, response) => {
    try {
        let expense = await model.Expense.findOne({_id: request.params.id})
        response.json(expense)
    } catch (error) {
        console.log(error)
        response.status(400).send("Generic Error.")
    }
})
app.delete("/expenses/:id", async (request, response) => {
    try {
        let isDeleted = await model.Expense.findByIdAndDelete({_id: request.params.id})
        if (!isDeleted) {
            response.status(404).send("Could not find expense :(.")
            return
        }
        response.status(204).send("Expense is deleted.")
    } catch (error) {
        console.log(error)
        response.status(400).send("Generic Error.")
    }
})
app.put("/expenses/:id", async (request, response) => {
    try {
        let updatedExpense = {category: request.body.category, amount: parseInt(request.body.amount), description: request.body.description}
        let putExpense = await model.Expense.findByIdAndUpdate({_id: request.params.id}, updatedExpense, {new: true})
        if (!putExpense) {
            response.status(404).send("Bruh, you're trying to update something that doesn't exist.  Learn how to use this API.")
            return
        }
        response.status(204).json(putExpense)
    } catch (error) {
        console.log(error)
        response.status(400).send("Generic Error.")
    }
})
app.listen(8080, () => {
    console.log("Server listening on http://localhost:8080.")
})