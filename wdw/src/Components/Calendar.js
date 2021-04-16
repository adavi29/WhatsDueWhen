import React, { useState, useContext, useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import { Route, Switch } from 'react-router-dom';
import Home from './Home';
import Error from './Error';
import { ViewState, EditingState, IntegratedEditing, Resources } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  DayView,
  WeekView,
  MonthView,
  DateNavigator,
  Appointments,
  TodayButton,
  AppointmentForm,
  AppointmentTooltip,
  ConfirmationDialog,
  Toolbar,
  ViewSwitcher,
} from '@devexpress/dx-react-scheduler-material-ui';

//import makeAppointments from './appointments'
import axios from 'axios';

let today = new Date();
let dd = String(today.getDate()).padStart(2, '0');
let mm = String(today.getMonth() + 1).padStart(2, '0');
let yyyy = today.getFullYear();

today = yyyy + '-' + mm + '-' + dd;

/*let appointments = [
    { startDate: '2018-11-01T09:45', endDate: '2018-11-01T11:00', title: 'Meeting' },
    { startDate: '2018-11-01T12:00', endDate: '2018-11-01T13:30', title: 'Go to a gym' },
  ];

  let resourceData = [
    { Name: 'EECS 168', PermissionNumber: '12345', Color: '#ea7a57' },
    { Name: 'EECS 268', PermissionNumber: '56789', Color: '#357CD2' },
    { Name: 'EECS 368', PermissionNumber: '24689', Color: '#7fa900' },
  ];*/

// const getUserEventsFromCourse = async (courseName) => {
//     await axios.get('http://localhost:5000/courses/calendar-events', {name: courseName}, {withCredentials: true})
//       .then(res => {console.log('[Calendar.js: 45] response: ' + res)})
//       .catch(err => {console.log('[Calendar.js: 46] err: ' + err)})

//       return ""
// }

// const getUserEventsFromCourseList = async (courseList) => {
//   console.log('entered getUserEVentsFromCourseList with courseList = ' + JSON.stringify(courseList))
//   let result = []

//   for(let courseName in courseList)
//   {
//     if(courseName != null)
//     {
//       let eventList = await getUserEventsFromCourse(courseName)
//       result.push(eventList)
//     }
//   }

//   return result
// }



export const Calendar = () => {
  const [data, setData] = useState(null);
  const [currentDate, setCurrentDate] = useState(today);
  const [eventList, setEventList] = useState([{ startDate: today, endDate: today, title: 'Meeting' }]);
  const [resources, setResources] = useState([
    {
      fieldName: 'class',
      title: 'Class',
      // instances: [{id: 'EECS 125', text: 'EECS 125', color: '#d01235'}],
      // instances: this.props,
    }
  ]);

  const commitChanges = ({ added, changed, deleted }) => {
    // this.setState((state) => {
    //   let { data } = state;
    //   if (added) {
    //     const startingAddedId = data.length > 0 ? data[data.length - 1].id + 1 : 0;
    //     data = [...data, { id: startingAddedId, ...added }];
    //   }
    //   if (changed) {
    //     data = data.map(appointment => (
    //       changed[appointment.id] ? { ...appointment, ...changed[appointment.id] } : appointment));
    //   }
    //   if (deleted !== undefined) {
    //     data = data.filter(appointment => appointment.id !== deleted);
    //   }
    //   return { data };
    // });
    console.log("hi");
    return data;
  }
  
  // getUserEvents = async () => {
  //   console.log('[Calendar.js: 108] entered getuserEvents')
  //   await axios.get('http://localhost:5000/users/events', {withCredentials: true})
  //     .then(res => {
  //       console.log('[Calendar.js: 111] res: ' + JSON.stringify(res)); 
  //       console.log('[Calendar.js: 112] res.data: ' + JSON.stringify(res.data)); 

  //       let rawCourseDataList = res.data
  //       let localList = []
  //       for(let i = 0; i < rawCourseDataList.length; ++i)
  //       {
  //         if(rawCourseDataList[i] != null)
  //         {
  //           localList.push(
  //             {
  //               title: rawCourseDataList[i].title, 
  //               startDate: new Date(2021, 4, 15, 10, 35),
  //               endDate: new Date(2021, 4, 15, 14, 30),
  //               id: 0,
  //               class: 'EECS 645',
  //             })
  //         }
  //       }

  //       console.log('localList', localList)
  //       this.setState((state, props) => ({eventList: localList}));
  //       console.log('eventList', this.state.eventList)
  //       return localList

  //     })
  //     .catch(err => {console.log('[Calendar.js: 139] got an error' + err)})
  // }

  useEffect(async () => {
    console.log('[Calendar.js: 108] entered getuserEvents')
    await axios.get('http://localhost:5000/users/events', {withCredentials: true})
      .then(res => {
        console.log('[Calendar.js: 111] res: ' + JSON.stringify(res)); 
        console.log('[Calendar.js: 112] res.data: ' + JSON.stringify(res.data)); 

        let rawCourseDataList = res.data
        let localList = []
        for(let i = 0; i < rawCourseDataList.length; ++i)
        {
          if(rawCourseDataList[i] != null)
          {
            localList.push(
              {
                title: rawCourseDataList[i].title, 
                startDate: new Date(2021, 4, 15, 10, 35),
                endDate: new Date(2021, 4, 15, 14, 30),
                id: 0,
                class: 'EECS 645',
              })
          }
        }

        console.log('localList', localList)
        setEventList(localList);

      })
      .catch(err => {console.log('[Calendar.js: 139] got an error' + err)})
  }, [])

  useEffect(() => {
    console.log(`Event list is ${JSON.stringify(eventList)}`);
  }, [eventList])

  // async componentDidMount() {
  //   console.log('eventList before set', this.state.eventList)
  //   let events = await this.getUserEvents()
  //   console.log('eventList after set', events)
  // }
  //const { currentDate, eventList } = this.state;
  return (
    <Paper>
      
      <Scheduler
        data={eventList}
        height={660}
      >
        <ViewState
          defaultCurrentDate={currentDate}
          defaultCurrentViewName="Week"
        />
        <EditingState
          onCommitChanges={commitChanges}
        />
        <IntegratedEditing />
        <DayView
          startDayHour={9}
          endDayHour={18}
        />
        <WeekView
          startDayHour={10}
          endDayHour={19}
        />
        <MonthView />
        <Toolbar />
        <DateNavigator />
        <TodayButton />
        <ViewSwitcher />
        <ConfirmationDialog />
        <Appointments />
        <AppointmentTooltip
          showOpenButton
          showDeleteButton
        />
        <AppointmentForm />

        {/* <Resources field='Class' title='Class' name='Class' textField='Name' idField='PermissionNumber' colorField='Color' dataSource={resourceData}/> */}
      </Scheduler>
    </Paper>
  );
}

export default Calendar;