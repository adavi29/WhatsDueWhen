import * as React from 'react';
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

import axios from 'axios';

let today = new Date();
let dd = String(today.getDate()).padStart(2, '0');
let mm = String(today.getMonth() + 1).padStart(2, '0');
let yyyy = today.getFullYear();

today = yyyy + '-' + mm + '-' + dd;


export default class Demo extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      currentDate: today,
      resources: [
        {
          fieldName: 'Class',
          title: 'Class',
          instances: [
            { id: 'BIO 100', text: 'BIO 100', color: '#ea7a57' },
            { id: 'EECS 268', text: 'EECS 268', color: '#357CD2' },
            { id: 'EECS 368', text: 'EECS 368', color: '#7fa900' },
          ],
        }
      ]
    };

    this.commitChanges = this.commitChanges.bind(this);
  }

  async componentDidMount() {

    await axios.get('http://localhost:5000/users/events', {withCredentials: true})
      .then(res => {

        // assigns ids to events
        let appointments = res.data
        let nextId = 0;
        appointments.forEach(appointment => {
          appointment.id = nextId
          nextId++;
        });

        this.setState({data: res.data})
      })
      .catch(err => {
        console.log(err)
      });
  }

  commitChanges({ added, changed, deleted }) {
    console.log("added", added)
    console.log("changed", changed)
    console.log("deleted", deleted)

    this.setState((state) => {
      let { data } = state;
      if (added) {
        const startingAddedId = data.length > 0 ? data[data.length - 1].id + 1 : 0;
        data = [...data, { id: startingAddedId, ...added }];

        // adds event to database
        axios.post('http://localhost:5000/courses/add-event', added)
          .then(res => {

          })
          .catch(err => {
            console.log(err)
          })
      }
      if (changed) {
        data = data.map(appointment => (
          changed[appointment.id] ? { ...appointment, ...changed[appointment.id] } : appointment));
      }
      if (deleted !== undefined) {
        const deletedCourse = data.find( ({ id }) => id === deleted)
        data = data.filter(appointment => appointment.id !== deleted);

        // deletes event in database
        axios.post('http://localhost:5000/courses/delete-event', deletedCourse)
          .then(res => {
            console.log("Course is deleted.")
          })
          .catch(err => {
            console.log(err);
          })
      }
      return { data };
    });
  }
  
  render() {
    const { currentDate, data, resources } = this.state;

    return (
      <Paper>
        
        <Scheduler
          data={data}
          height={660}
        >
          <ViewState
            defaultCurrentDate={currentDate}
            defaultCurrentViewName="Week"
          />
          <EditingState
            onCommitChanges={this.commitChanges}
          />
          <IntegratedEditing />
          <DayView
            startDayHour={9}
            endDayHour={18}
          />
          <WeekView
            startDayHour={7}
            endDayHour={24}
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
          <Resources
              data={resources}
              mainResourceName='Class'
            />
          {/* <Resources field='Class' title='Class' name='Class' textField='Name' idField='PermissionNumber' colorField='Color' dataSource={resourceData}/> */}
        </Scheduler>
      </Paper>
    );
  }
}