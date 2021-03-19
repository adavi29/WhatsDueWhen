import React, { Component, useEffect, useState } from 'react';
import { Router, Route, Switch, useHistory } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import './CreateUser.css'
import wdw from './wdw.png'
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Divider from '@material-ui/core/Divider';

//Providing global access to logged-in user email
import { Context } from './ContextProvider';

//For contecting to our backend
import axios from 'axios';

export const CreateUser = (props) => {
    const {setUserEmailContext, isProfessor} = React.useContext(Context);

    const [userEmail, setUserEmail] = useState("");
    const [userFirstName, setUserFirstName] = useState("");
    const [userLastName, setUserLastName] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const [userPasswordEntered, setUserPasswordEntered] = useState("");

    const handleCreate = () => {
        let unfilledField = false;
        if (userFirstName == "" || userLastName == "" || userEmail == "" || userPassword == ""){
            alert("Please fill all fields!");
            unfilledField = true;
        }
        if (userPassword != userPasswordEntered){
            alert("Your passwords don't match!");
        }
        if (!unfilledField){
            const newUser = {
                firstname: userFirstName,
                lastname: userLastName,
                email: userEmail,
                password: userPassword,
                isProfessor: isProfessor,
                classList: []
            }
        }
    };

    return(
        <Paper className='login'>
            <img className='wdw' src={wdw} />
            <div className='title'>
                <div className='logintext'>
        <Typography variant="h4" gutterBottom>
            Create Your Account
         </Typography>
         </div>
         </div>
         <div className='name'>
             <div className='fname'>
                <FormControl fullWidth variant="outlined" className='fname'>
                    <InputLabel >First Name</InputLabel>
                    <OutlinedInput 
                        id='email'
                        onChange={(event)=>{setUserFirstName(event.target.value)}}
                    />
                </FormControl>
                </div>
                <div className='lname'>
                <FormControl fullWidth variant="outlined" className='lname'>
                    <InputLabel >Last Name</InputLabel>
                    <OutlinedInput 
                        id='email'
                        onChange={(event)=>{setUserLastName(event.target.value)}}    
                    />
                </FormControl>
                </div>
                </div>
            <div className='info'>
            
                <div className='email'>
                <FormControl fullWidth variant="outlined" >
                    <InputLabel >Email Address</InputLabel>
                    <OutlinedInput 
                        id='email'
                        onChange={(event)=>{setUserEmail(event.target.value)}}  
                    />
                </FormControl>
                </div>
                <div className='password'>
                <FormControl fullWidth variant="outlined" >
                    <InputLabel >Password</InputLabel>
                    <OutlinedInput 
                        id='email'
                        type='password' 
                        onChange={(event)=>{setUserPassword(event.target.value)}}
                    />
                </FormControl>
                </div>
                <div className='password'>
                    <FormControl fullWidth variant="outlined" >
                        <InputLabel >Re-Enter Password</InputLabel>
                        <OutlinedInput 
                            id='email'
                            type='password'
                            onChange={(event)=>{setUserPasswordEntered(event.target.value)}}
                        />
                    </FormControl>
                </div>
            </div>
            <div className='loginbutton'>
                <Button variant="contained" size="medium" color="primary" style={{width: '230px'}}
                    onClick={handleCreate}>
                    Create Account
                </Button>
            </div>
            <div className='or'>
                <Typography>OR</Typography>
            </div>
            <div className='logingoogle'>
                <Button variant="contained" size="medium" color="default" style={{width: '230px'}}>
                    Continue with Google
                </Button>
            </div>
        </Paper>
    )
};

export default CreateUser;