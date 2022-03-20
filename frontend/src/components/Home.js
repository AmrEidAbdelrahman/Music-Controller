import React, { useEffect, useState } from 'react';
import Join from './Join';
import Create from './Create';
import { Grid, Button, ButtonGroup, Typography, Container, makeStyles } from "@material-ui/core";

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
    useEffect(async ()=>{
      await fetch("https://spo-music-controller.herokuapp.com/api/user-in-room/", {
          method: "GET",
          headers: {
              'Content-Type': 'application/json'
          }
      })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
          setRoomCode(data.code);
      })
      return ( setRoomCode(null) )
    }, [])
    
    const renderHomePage = () => {
        return (
          <Container >
            <Grid container spacing={3} >
              <Grid item xs={12} align="center">
                <Typography variant="h3" compact="h3">
                  House Party
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
          </Container>
          
        );
      }

    return (
        <Router>
            <Switch>
                <Route exact path='/' render={() => {
                  if (roomCode){
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