import React, { useState, useEffect } from 'react';
import './CalendarPage.css';
// import Calendar from './Calendar';
import Calendar from './Calendar';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import SubjectSelector from './SubjectSelector';
import { BrowserRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

//For contecting to our backend
import axios from 'axios';
import SubjectSelectorStudent from './SubjectSelectorStudent';

export const CalendarPageStudent = () => {
  //handles opening and closing dialog 1
  const [open, setOpen] = useState(false);
  const [openAddClass, setOpenAddClass] = useState(false);
  const [userDeptCode, setUserDeptCode] = useState("");
  const [userCourseNumber, setUserCourseNumber] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [userPermissionNumber, setUserPermissionNumber] = useState("");
  let [correctPermissionCode, setCorrectPermissionCode] = useState(false);
  let [classExistsAlready, setClassExistsAlready] = useState(false);
  const [subjectList, setSubjectList] = useState([]);
  const [addSubject, setAddSubject] = useState(false);

  useEffect(async () => {
    await axios.get('http://localhost:5000/users/courses', {withCredentials: true})
      .then(res => {
        //console.log(res.data)
        setSubjectList(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  
    // loadSubjects();
  }, []);

  useEffect(() => {
    loadSubjects();
  }, [addSubject]);

  const handleClickOpenAddClass = () => {
    setOpenAddClass(true);
  };

  const handleCloseAddClass = () => {
    setOpenAddClass(false);
    setCorrectPermissionCode(false);
    setClassExistsAlready(false);
  };


  const handleAddClass = () => {
    let unfilledField = false;
    if (userDeptCode == "" || userCourseNumber == "" || userPermissionNumber == ""){
      alert("Please fill all the required fields!");
      unfilledField = true;
    }
    
    if (!unfilledField){
      Promise.all([
        axios.get('http://localhost:5000/users/courses', {withCredentials: true}),
        axios.get('http://localhost:5000/courses/')
      ]).then(([userClassList, allCourses]) => {

          // ---------------------------------------------------//
          // list of all classes in the currently logged in user
          let userList = userClassList.data;

          // check if user has no classes
          let emptyClassList = false;
          if(userList.length == 0)
          {
              emptyClassList = true;
          }

          //check if user is already enrolled in this class
          //get course that has the given permission number from userList
          let alreadyExists = true;
          let course = userList.find(classObj => classObj.permissionNumber == userPermissionNumber)
          if(course == undefined)
          {
            alreadyExists = false;
          }

          // -------------------------------------//
          // list of all classes in the courses db
          let masterList = allCourses.data;

          // check for if the permission number is correct
          let correctPermissionNumber = false;
          let foundCourseName = '';
          let matchingPermNumberList = masterList.filter((course) => (course.permissionNumber == userPermissionNumber));
          if(matchingPermNumberList.length == 1)
          {
              foundCourseName = matchingPermNumberList[0].courseTitle;
              correctPermissionNumber = true;
          }

          // -------------------------------------//
          //check for all conditions to add a class
          if((emptyClassList || !alreadyExists) && correctPermissionNumber)
          {
            const course = {
              deptCode: userDeptCode.toUpperCase(),
              courseNumber: userCourseNumber,
              courseTitle: foundCourseName,
              permissionNumber: userPermissionNumber
            }

            subjectList.push(course);

            axios.post('http://localhost:5000/users/add-course', 
              course, {withCredentials: true})
              .then(res => {
                console.log(res);
              })
              .catch(err => {
                console.log(err);
              });
              alert('Class added to your calendar!');

              setAddSubject(!addSubject);

              handleCloseAddClass();
          }
          else if(!correctPermissionNumber)
          {
              alert("Incorrect permission number and class combination!");

          }
          else if(alreadyExists)
          {
              alert("This class already exists in your calendar. Try adding a different class!");
              handleCloseAddClass();
              handleClickOpenAddClass();
          }

      }).catch((err) => {
          console.log(err);
      });
      
    }
  };

  //returns the subject cards on the left side of calendar
  const loadSubjects = () => {
    console.log("load subjects", subjectList)

    //check if list if empty
    if (subjectList != []) {
      return (
        <div>
          {subjectList.map(item => {
            //const permNum = item.permissionNumber;
            const name = item.deptCode + " " + item.courseNumber + ": " + item.courseTitle;
            return <div><SubjectSelectorStudent name={name}/></div>
          })}
        </div>
      )
    }
  }

  return (
    <Paper className='CalendarPage'>
      <Paper style={{ width: "23%", float: "left" }}>
        <div className="createclass">
      <Button variant="outlined" color="primary" onClick={handleClickOpenAddClass}>
            Add a Class
      </Button>
      </div>
            {openAddClass && 
          <div>
            <Dialog open={openAddClass} onClose={handleCloseAddClass} aria-labelledby="form-dialog-title">
              <DialogTitle id="form-dialog-title">Add a Class</DialogTitle>
              <DialogContent>
              <DialogContentText>
                   Please enter the information of the class you want to add:
              </DialogContentText>
              <div className="deptcode">
                  <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Department Code"
                    type="text"
                    onChange={(event)=>{setUserDeptCode(event.target.value)}}
                  /> 
                </div>
              <div className="coursenum">
                  <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Course Number"
                    type="text"
                    onChange={(event)=>{setUserCourseNumber(event.target.value)}}
                  /> 
                </div>
                <div className="permnum">
                  <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Permission Number"
                    type="text"
                    fullWidth
                    onChange={(event)=>{setUserPermissionNumber(event.target.value)}}
                  /> 
                </div>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseAddClass} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleAddClass} color="primary">
                  Continue
                </Button>
              </DialogActions>
            </Dialog>
          </div>}

        {loadSubjects()}
      </Paper>
      <Paper style={{ width: "75%", height: "50%", float: "left", marginLeft: "15px" }}>
        <BrowserRouter>
          <Calendar />
        </BrowserRouter>
      </Paper>
    </Paper>

  )
};

export default CalendarPageStudent;