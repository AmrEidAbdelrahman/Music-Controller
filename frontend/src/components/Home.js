import React, { useEffect, useState } from 'react';
import Join from './Join';
import Create from './Create';
import { Grid, Button, ButtonGroup, Typography } from "@material-ui/core";

import {
    BrowserRouter as Router,
    Link,
    Switch,
    Route,
    Redirect
    } from 'react-router-dom';
import Room from './Room';


const Home = () => {

    const [roomCode, setRoomCode] = useState(null);
    console.log("first value after declaration",roomCode); // gives REAL_CODE not null after refresh
    useEffect(()=>{
      console.log("Home Here!");
      console.log("first lline in useEffect:", roomCode);
      fetch("http://127.0.0.1:8000/api/user-in-room/", {
          method: "GET",
          headers: {
              'Content-Type': 'application/json'
          }
      })
      .then((response) => {console.log(response);return response.json();})
      .then((data) => {
          //console.log("home data: ",data);
          setRoomCode(data.code);
          //console.log("room from home:", roomCode);
      })
     //return ( setRoomCode(null) )
    }, [])
    
    const renderHomePage = () => {
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} align="center">
              <Typography variant="h3" compact="h3">
                House Party {roomCode}
              </Typography>
            </Grid>
            <Grid item xs={12} align="center">
              <ButtonGroup disableElevation variant="contained" color="primary">
                <Button color="primary" to="/join" component={Link}>
                  Join a Room
                </Button>
                <Button color="secondary" to="/create" component={Link}>
                  Create a Room
                </Button>
              </ButtonGroup>
            </Grid>
          </Grid>
        );
      }

    return (
        <Router>
            <Switch>
                <Route exact path='/' render={() => {
                  console.log('reoute',roomCode);
                  return roomCode ? <Redirect to={`room/${roomCode}/`}/>  : renderHomePage()   
                }}>
                </Route>
                <Route path="/join/" component={Join}/>
                <Route path="/create/" component={Create}/>
                <Route path="/room/:room_code" component={Room}/>
            </Switch>            
        </Router>
    );
}
 
export default Home;