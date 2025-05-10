const mongoose = require("mongoose")
mongoose.connect("mongodb+srv://se4200alex:HaJMCTwz4ySgib5b@cluster0.smvvrev.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
const ExpenseSchema = new mongoose.Schema({category: {type: String, required: [true, "Expense needs to be a category"]}, amount: {type: Number, required: [true, "Expense needs to have an amount"]}, description: {type: String, required: [true, "Expense needs to have a description"]}}, {timestamps: true})
const Expense = mongoose.model("Expense", ExpenseSchema)
module.exports = {Expense: Expense}