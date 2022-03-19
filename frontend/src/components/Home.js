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
    //console.log("first value after declaration",roomCode);
    useEffect(async ()=>{
      console.log("Home useEffect");
      //console.log("first lline in useEffect:", roomCode);
      await fetch("http://127.0.0.1:8000/api/user-in-room/", {
          method: "GET",
          headers: {
              'Content-Type': 'application/json'
          }
      })
      .then((response) => {
        console.log("3 ", response);
        return response.json();
      })
      .then((data) => {
          setRoomCode(data.code);
      })
      return ( setRoomCode(null) )
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
                  if (roomCode){
                    console.log('log 1 ',roomCode);
                    //setRoomCode(null);
                    return <Redirect to={`room/${roomCode}/`}/>
                  }
                  else {
                    console.log("log 4")
                    return renderHomePage();
                  }
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