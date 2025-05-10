const mongoose = require("mongoose")
mongoose.connect("mongodb+srv://se4200alex:HaJMCTwz4ySgib5b@cluster0.smvvrev.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
const StudentSchema = new mongoose.Schema({name: {type: String, required: [true, "Student must have a name."]}, major: {type: String, required: [true, "Student must have a major."]}})
const Student = mongoose.model("Student", StudentSchema)
module.exports = {Student: Student}