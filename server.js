/********************************************************************************* 
 *  WEB700 – Assignment 06
 *  I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part 
 *  of this assignment has been copied manually or electronically from any other source 
 *  (including 3rd party web sites) or distributed to other students. 
 *  
 *  Name: Vaibhav Jaysinh Rajput 
 *  Student ID: 144444239 
 *  Date: 09/08/2024 
 ********************************************************************************/
const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const data = require("./modules/collegeData.js");
const collegeData = require('./modules/collegeData.js');


const app = express();

const HTTP_PORT = process.env.PORT || 8080;
//Assignment-5
app.engine('.hbs', exphbs.engine({ 
    defaultLayout: 'main',
    extname: '.hbs',
    helpers: {
        navLink: function(url, options){
            return '<li' + 
                ((url == app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') + 
                '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }        
    }
}));

app.set('view engine', '.hbs');

app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));
//Assignment-5
app.use(function(req,res,next){
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));    
    next();
});


app.get("/", (req,res) => {
    res.render("home");
});

app.get("/about", (req,res) => {
    res.render("about");
});

app.get("/htmlDemo", (req,res) => {
    res.render("htmlDemo");
});

app.get('/students', (req, res) => {
    collegeData.getAllStudents().then((data) => {
        if (data.length > 0) {
            res.render("students", { students: data });
        } else {
            res.render("students", { message: "no results" });
        }
    }).catch((err) => {
        res.render("students", { message: "no results" });
    });
});




app.get('/students/add', (req, res) => {
    collegeData.getCourses().then((data) => {
        res.render('addStudent', { courses: data });
    }).catch(() => {
        res.render('addStudent', { courses: [] });
    });
});




app.post('/students/add', (req, res) => {
    // Make sure the course field is correctly captured
    let studentData = req.body;
    collegeData.addStudent(studentData).then(() => {
        res.redirect('/students');
    }).catch((err) => {
        res.status(500).send("Unable to Add Student");
    });
});

app.get("/student/:studentNum", (req, res) => { 
 
    // initialize an empty object to store the values     
    let viewData = {}; 
 
    data.getStudentByNum(req.params.studentNum).then((data) => {         
        if (data) { 
            viewData.student = data; //store student data in the "viewData" object as "student" 
        } else { 
            viewData.student = null; // set student to null if none were returned 
        } 
    }).catch((err) => { 
        viewData.student = null; // set student to null if there was an error  
    }).then(data.getCourses) 
    .then((data) => { 
        viewData.courses = data; // store course data in the "viewData" object as "courses" 
 
        // loop through viewData.courses and once we have found the courseId that matches 
        // the student's "course" value, add a "selected" property to the matching          
        // viewData.courses object 
 
        for (let i = 0; i < viewData.courses.length; i++) { 
            if (viewData.courses[i].courseId == viewData.student.course) {                 
                viewData.courses[i].selected = true; 
            } 
        } 
 
    }).catch((err) => { 
        viewData.courses = []; // set courses to empty if there was an error 
    }).then(() => { 
        if (viewData.student == null) { // if no student - return an error             
            res.status(404).send("Student Not Found"); 
        } else { 
            res.render("student", { viewData: viewData }); // render the "student" view 
        } 
    }); 
}); 





app.post('/student/update', (req, res) => {
    collegeData.updateStudent(req.body).then(() => {
        res.redirect('/students');  // Redirects to the student list
    }).catch((err) => {
        res.status(500).send("Unable to Update Student");
    });
});



app.get('/student/delete/:studentNum', (req, res) => {
    collegeData.deleteStudentByNum(req.params.studentNum).then(() => {
        res.redirect('/students');
    }).catch((err) => {
        res.status(500).send("Unable to Remove Student / Student not found");
    });
});


app.get('/courses', (req, res) => {
    collegeData.getCourses().then((data) => {
        if (data.length > 0) {
            res.render("courses", { courses: data });
        } else {
            res.render("courses", { message: "no results" });
        }
    }).catch((err) => {
        res.render("courses", { message: "no results" });
    });
});


app.get("/course/:id", (req, res) => {
    data.getCourseById(req.params.id).then((data) => {
        res.render("course", { course: data }); 
    }).catch((err) => {
        res.render("course",{message:"no results"}); 
    });
});

app.get('/courses/add', (req, res) => {
    res.render('addCourse');
});

app.post('/courses/add', (req, res) => {
    collegeData.addCourse(req.body).then(() => {
        res.redirect('/courses');  // Redirect to the courses list after adding the course
    }).catch((err) => {
        res.status(500).send("Unable to Add Course");
    });
});

app.post('/course/update', (req, res) => {
    collegeData.updateCourse(req.body).then(() => {
        res.redirect('/courses');  // Redirect to the courses list after updating the course
    }).catch((err) => {
        res.status(500).send("Unable to Update Course");
    });
});



app.get('/course/delete/:id', (req, res) => {
    collegeData.deleteCourseById(req.params.id).then(() => {
        res.redirect('/courses');  // Redirect to the courses list after deleting the course
    }).catch((err) => {
        res.status(500).send("Unable to Remove Course / Course not found");
    });
});


app.use((req,res)=>{
    res.status(404).send("Page Not Found");
});


data.initialize().then(function(){
    app.listen(HTTP_PORT, function(){
        console.log("app listening on: " + HTTP_PORT)
    });
}).catch(function(err){
    console.log("unable to start server: " + err);
});

