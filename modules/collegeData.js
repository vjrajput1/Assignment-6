const Sequelize = require('sequelize');

const sequelize = new Sequelize('SenecaDB','SenecaDB_owner','U6Kgwvmj9lzF',{
    host:'ep-white-leaf-a5uwktna.us-east-2.aws.neon.tech',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    logging: console.log,
    query: { raw: true }
});


const Student = sequelize.define('Student', {
    studentNum: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressProvince: Sequelize.STRING,
    TA: Sequelize.BOOLEAN,
    status: Sequelize.STRING,
    course: Sequelize.INTEGER // Foreign key field
});

const Course = sequelize.define('Course', {
    courseId: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    courseCode: Sequelize.STRING,
    courseDescription: Sequelize.STRING
});

Course.hasMany(Student, { foreignKey: 'course' });
Student.belongsTo(Course, { foreignKey: 'course' });

module.exports.initialize = function () {
    return new Promise((resolve, reject) => {
        sequelize.sync()
            .then(() => resolve())
            .catch(err => reject("unable to sync the database: " + err));
    });
};

module.exports.getAllStudents = function(){
    return new Promise((resolve, reject) => {
        Student.findAll()
            .then(data => resolve(data))
            .catch(err => reject("no results returned: " + err));
    });
};

module.exports.getCourses = function(){
   return new Promise((resolve, reject) => {
       Course.findAll()
           .then(data => resolve(data))
           .catch(err => reject("no results returned: " + err));
   });
};

module.exports.getStudentByNum = (num) => {
    return new Promise((resolve, reject) => {
        Student.findAll({
            where: { studentNum: num }
        }).then((data) => {
            resolve(data[0]);
        }).catch(() => {
            reject("no results returned");
        });
    });
};


module.exports.getStudentsByCourse = function (course) {
    return new Promise((resolve, reject) => {
        Student.findAll({ where: { course: course } })
            .then(data => resolve(data))
            .catch(err => reject("query returned 0 results: " + err));
    });
};

module.exports.getCourseById = (id) => {
    return new Promise((resolve, reject) => {
        Course.findAll({
            where: { courseId: id }
        }).then((data) => {
            resolve(data[0]);
        }).catch(() => {
            reject("no results returned");
        });
    });
};


module.exports.addStudent = (studentData) => {
    return new Promise((resolve, reject) => {
        studentData.TA = (studentData.TA) ? true : false;
        for (let prop in studentData) {
            if (studentData[prop] === "") {
                studentData[prop] = null;
            }
        }
        Student.create(studentData).then(() => {
            resolve();
        }).catch(() => {
            reject("unable to create student");
        });
    });
};


module.exports.updateStudent = (studentData) => {
    return new Promise((resolve, reject) => {
        studentData.TA = (studentData.TA) ? true : false;
        for (let prop in studentData) {
            if (studentData[prop] === "") {
                studentData[prop] = null;
            }
        }
        Student.update(studentData, {
            where: { studentNum: studentData.studentNum }
        }).then(() => {
            resolve();
        }).catch(() => {
            reject("unable to update student");
        });
    });
};



module.exports.addCourse = (courseData) => {
    return new Promise((resolve, reject) => {
        // Convert empty strings to null values to ensure correct database entry
        for (let prop in courseData) {
            if (courseData[prop] === "") {
                courseData[prop] = null;
            }
        }
        // Create a new course record in the database
        Course.create(courseData).then(() => {
            resolve();  // Resolve the promise if the course was successfully added
        }).catch(() => {
            reject("unable to create course");  // Reject the promise if an error occurs
        });
    });
};



module.exports.updateCourse = (courseData) => {
    return new Promise((resolve, reject) => {
        // Convert empty strings to null values to ensure correct database entry
        for (let prop in courseData) {
            if (courseData[prop] === "") {
                courseData[prop] = null;
            }
        }
        // Update the course record in the database
        Course.update(courseData, {
            where: { courseId: courseData.courseId }
        }).then(() => {
            resolve();  // Resolve the promise if the course was successfully updated
        }).catch(() => {
            reject("unable to update course");  // Reject the promise if an error occurs
        });
    });
};



module.exports.deleteCourseById = (id) => {
    return new Promise((resolve, reject) => {
        // Delete the course record from the database
        Course.destroy({
            where: { courseId: id }
        }).then(() => {
            resolve();  // Resolve the promise if the course was successfully deleted
        }).catch(() => {
            reject("unable to delete course");  // Reject the promise if an error occurs
        });
    });
};



module.exports.deleteStudentByNum = (studentNum) => {
    return new Promise((resolve, reject) => {
        Student.destroy({
            where: { studentNum: studentNum }
        }).then(() => {
            resolve();
        }).catch(() => {
            reject("unable to delete student");
        });
    });
};


