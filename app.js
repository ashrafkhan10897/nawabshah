const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");

//Mongo Atlas URL
const dbUrl = "mongodb+srv://nawabshah:2i9Z5lBWSONmqj1J@cluster0.czv7w3j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

// Connect to MongoDB
mongoose.connect(dbUrl)
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("Error connecting to MongoDB:", err));

// Define a Mongoose schema for results
const marksSchema7 = new mongoose.Schema({
    name: String,
    rollNo: Number,
    branch: String,
    semester: Number,
    wtLabInternal: Number,
    wtLabExternal: Number,
    sqaTheoryInternal: Number, // Include marks field
});
const marksSchema5 = new mongoose.Schema({
    name: String,
    rollNo: Number,
    branch: String,
    semester: Number,
    rdsLabInternal: Number,
    rdsLabExternal: Number,
    rdsTheoryInternal: Number, // Include marks field
});

// Create a Mongoose model based on the 7th sem schema
const Marks7 = mongoose.model("Marks7", marksSchema7);
// Create a Mongoose model based on the 5th sem schema
const Marks5 = mongoose.model("Marks5", marksSchema5);

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));

// Middleware to parse incoming request bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static('public'));

app.get('/',(req,res)=>{
    res.render("result.ejs");
})

//path to get student result for 7th sem
app.get('/result', async (req, res) => {
    // Access the submitted data from the query parameters
    const { rollNo, branch } = req.query;
    if(branch=="CSE"){
        try {
            // Query the database to find the result based on roll number and branch
            const marks = await Marks7.findOne({ rollNo, branch });
            if (marks) {
                const name = marks.name;
                const rollNo = marks.rollNo;
                const branch = marks.branch;
                const semester = marks.semester;
                const wtLabInternal = marks.wtLabInternal;
                const wtLabExternal = marks.wtLabExternal;
                const sqaTheoryInternal = marks.sqaTheoryInternal;
                // Render the result page with the fetched result
                res.render("studentresult.ejs", { name,rollNo,branch,semester,wtLabInternal,wtLabExternal,sqaTheoryInternal });
            } else {
                // If result not found, render an error message
                res.render("error.ejs", { message: "Result not found" });
            }
        } catch (error) {
            // Render an error page if there's an error fetching data from the database
            res.render("error.ejs", { message: "Error fetching result from database" });
        }
    }else{
        try {
            // Query the database to find the result based on roll number and branch
            const marks = await Marks5.findOne({ rollNo, branch });
            if (marks) {
                const name = marks.name;
                const rollNo = marks.rollNo;
                const branch = marks.branch;
                const semester = marks.semester;
                const rdsLabInternal = marks.rdsLabInternal;
                const rdsLabExternal = marks.rdsLabExternal;
                const rdsTheoryInternal = marks.rdsTheoryInternal;
                // Render the result page with the fetched result
                res.render("studentresult.ejs", { name,rollNo,branch,semester,rdsLabInternal,rdsLabExternal,rdsTheoryInternal });
            } else {
                // If result not found, render an error message
                res.render("error.ejs", { message: "Result not found" });
            }
        } catch (error) {
            // Render an error page if there's an error fetching data from the database
            res.render("error.ejs", { message: "Error fetching result from database" });
        }
    }
});

//path to redirect to result page
app.get("/redirect",(req,res)=>{
    res.redirect("/");
})

//Admin path to add marks
app.get("/admin",(req,res)=>{
    res.render("admin.ejs");
})

//Admin path to 5th sem
app.get("/admin5",(req,res)=>{
    res.render("admin5.ejs");
})

//Admin path to 7th sem
app.get("/admin7",(req,res)=>{
    res.render("admin7.ejs");
})

//Path to submit to database in 7th sem model
app.post("/submit7",(req,res)=>{
    let studentMarks = new Marks7(req.body.student);
    studentMarks.save();
    res.redirect("/admin7");
})

//Path to submit to database in 5th sem model
app.post("/submit5",(req,res)=>{
    let studentMarks = new Marks5(req.body.student);
    studentMarks.save();
    res.redirect("/admin5");
})

app.listen(8080,()=>{
    console.log("listening on port 8080");
})

