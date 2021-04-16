import React, {useEffect, useState } from 'react';
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
import appointments from './appointments'

const generateRandomInt = () => {
  let min = 100000;
  let max = 999999;
  let randNumber = Math.random() * (max - min) + min;
  let intRand = Math.floor(randNumber);
  return(intRand);
}

export const CalendarPage = () => {
  //handles opening and closing dialog 1
  const [open, setOpen] = useState(false);
  const [userDeptCode, setUserDeptCode] = useState("");
  const [userCourseNumber, setUserCourseNumber] = useState("");
  const [userCourseTitle, setUserCourseTitle] = useState("");
  const [userCourseDescription, setUserCourseDescription] = useState("");
  const [userStartDate, setUserStartDate] = useState("");
  const [userEndDate, setUserEndDate] = useState("");
  const [generatedPermissionNumber, setGeneratedPermissionNumber] = useState(0);
  const [subjectList, setSubjectList] = useState([]);
  const [addSubject, setAddSubject] = useState(false);
  

  useEffect(async () => {
    await axios.get('http://localhost:5000/users/courses', {withCredentials: true})
      .then(res => {
        // console.log(res.data)
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
  
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  //handles opening and closing dialog 2
  const [open2, setOpen2] = useState(false);
  const handleClickOpen2 = () => {
    setOpen2(true);
  };

  const handleClose2 = () => {
    setOpen2(false);
  };

   const handleCreate = async () => {

    let unfilledField = false;
    if (userDeptCode == "" || userCourseNumber == "" || userStartDate == "" || userEndDate == ""){
        alert("Please fill all the required fields!");
        unfilledField = true;
    }
    let randNumber;

    if (!unfilledField){
      // generates a unique number for a classes permission number
      await axios.get('http://localhost:5000/courses/')
        .then(res => {
          let min = 100000;
          let max = 999999;
          randNumber = Math.floor(Math.random() * (max - min) + min);
          let returnedCourse = res.data.filter((course) => (course.permissionNumber == randNumber));
          while (returnedCourse.length != 0)
          {
              randNumber = Math.floor(Math.random() * (max - min) + min);
              returnedCourse = res.data.filter((course) => (course.permissionNumber == randNumber));
          }
          console.log(randNumber);
          setGeneratedPermissionNumber(randNumber);
      });
      
      // The new course object
      const newCourse = {
        deptCode: userDeptCode.toUpperCase(),
        courseNumber: userCourseNumber,
        courseTitle: userCourseTitle,
        courseDescription: userCourseDescription,
        startDate: userStartDate,
        endDate: userEndDate,
        permissionNumber: randNumber
      }
      

      // adds course to courses database
      axios.post('http://localhost:5000/courses/add/', newCourse)
        .then(res => {
          console.log(res);

          // adds course to the logged in user
          axios.post('http://localhost:5000/users/add-course', 
            {
              deptCode: userDeptCode.toUpperCase(),
              courseNumber: userCourseNumber,
              courseTitle: userCourseTitle,
              permissionNumber: randNumber
            }, {withCredentials: true})
            .then(res => {
              console.log(res);
              subjectList.push(newCourse);
              alert("Class was created successfully!");
            })
            .catch(err => {
              console.log(err);
            });

        })
        .catch(err => {
          // emit different kinds of errors? one for duplicate class and another for invalid form input?

          // handles duplicate key error. Responds with a 422 status
          if (err.response.status === 422){
            alert("The class you are trying to create already exists!")
          }

          console.log(err.response);
        });

      subjectList.push(newCourse);
      setAddSubject(!addSubject);
    }
    setOpen(false);
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
            const permNum = 5;
            //const name = item.deptCode + " " + item.courseNumber + ": " + item.courseTitle;
            const name = "dummy_name"
            return <div><SubjectSelector name={name} permNum={permNum}/></div>
          })}
        </div>
      )
    }
  }

  return (
    <Paper className='CalendarPage'>
      <Paper style={{ width: "23%", float: "left" }}>
        <div className="createclass">
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
            Create a Class
      </Button>
      </div>
        {open && 
          <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
              <DialogTitle id="form-dialog-title">Create a Class</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Please enter information regarding the course
                </DialogContentText>
                <div className="deptcode">
                  <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Department Code"
                    type="text"
                    required
                    onChange={(event)=>{setUserDeptCode(event.target.value)}}
                  /> 
                </div>
                <div className="coursenum">
                  <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Course Number"
                    type="number"
                    required
                    onChange={(event)=>{setUserCourseNumber(event.target.value)}}
                  /> 
                </div>
                <div className="coursetitle">
                  <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Course Title (optional)"
                    type="text"
                    fullWidth
                    onChange={(event)=>{setUserCourseTitle(event.target.value)}}
                  /> 
                </div>
                <div className="coursedescription">
                 <TextField
                    margin="dense"
                    id="standard-multiline-static"
                    label="Course Description (optional)"
                    multiline
                    rows={3}
                    fullWidth
                    onChange={(event)=>{setUserCourseDescription(event.target.value)}}
                  />
      
                </div>
                <form className="startdate" noValidate>
                  <TextField
                    id="date"
                    label="Start Date"
                    type="date"
                    defaultValue={new Date()}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={(event)=>{setUserStartDate(event.target.value)}}
                  />
                </form>
                <form className="enddate" noValidate>
                  <TextField
                    id="date"
                    label="End Date"
                    type="date"
                    defaultValue={new Date()}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={(event)=>{setUserEndDate(event.target.value)}}
                  />
                </form>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleCreate} color="primary">
                  Add
                </Button>
              </DialogActions>
            </Dialog>
          </div>}
          {open2 && 
            <div>
              <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Create a Class</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Your course has been created! To add events, navigate to the course's calendar and double click the calendar to bring up the event form.
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose2} color="primary">
                    Finish
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

export default CalendarPage;