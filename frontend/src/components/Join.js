import React, { useState } from 'react';
import { TextField, Button, Grid, Typography } from "@material-ui/core";
import { Link, useHistory } from 'react-router-dom';

const Join = () => {
    const [roomCode, setRoomCode] = useState(null);
    const [error, setError] = useState(null);
    const history = useHistory()
    
    const handleTextFieldChange = (e) => {
        setRoomCode(e.target.value);
        setError(null);
    }

    const roomButtonPressed = () => {
        console.log("roomButtonPressed");
        fetch("http://127.0.0.1:8000/api/join-room/", {
            method:"POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({'room_code':roomCode})
        })
        .then((response)=> {
            if (response.ok){
                history.push(`/room/${roomCode}/`);
            }
            else {
                setError("Not Found");
            }
            return response.json();
        })
        .then((data)=> {
            console.log(data);
        })
    }

    return (
        <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Typography variant="h4" component="h4">
            Join a Room
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <TextField
            error={error}
            label="Code"
            placeholder="Enter a Room Code"
            value={roomCode}
            helperText={error}
            variant="outlined"
            onChange={(e) => handleTextFieldChange(e)}
          />
        </Grid>
        <Grid item xs={12} align="center">
          <Button
            variant="contained"
            color="primary"
            onClick={roomButtonPressed}
          >
            Enter Room
          </Button>
        </Grid>
        <Grid item xs={12} align="center">
          <Button variant="contained" color="secondary" to="/" component={Link}>
            Back
          </Button>
        </Grid>
      </Grid>
    );
}
 
export default Join;