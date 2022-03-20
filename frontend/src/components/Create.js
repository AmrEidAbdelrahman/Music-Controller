import React, { useState } from 'react';
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import { Link } from "react-router-dom";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { useHistory } from 'react-router-dom';
import Collapse from '@material-ui/core/Collapse'
import Alert from '@mui/material/Alert';

const Create = (props) => {
    const [votesToSkip, setVotesToSkip] = useState(props.votesToSkip ? props.votesToSkip : 2);
    const [guestCanPause, setGuestCanPause] = useState(props.guestCanPause ? props.guestCanPause : false);
    const [successMsg, setSuccessMsg] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const history = useHistory();
    const editing = props.editing ? props.editing : false;
    const handleGuestCanPauseChange = (e) => {
        setGuestCanPause( e.target.value === "true" ? true : false);
    }

    const handleVotesChange = (e) => {
        setVotesToSkip(e.target.value);
    }

    const handleRoomButtonPressed = () => {
        console.log(guestCanPause);
        console.log(votesToSkip);
        fetch("https://spo-music-controller.herokuapp.com/api/room/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'votes_to_skip': votesToSkip, 'guest_can_pause': guestCanPause})
        })
        .then((response) => response.json())
        .then((data) => {
          console.log(`room/${data.code}/`);
          history.push(`/room/${data.code}/`)
        })
    }

    const handleRoomUpdate = () => {
      console.log("Updating ....");
      console.log(guestCanPause);
      console.log(votesToSkip);
      fetch(`https://spo-music-controller.herokuapp.com/api/room/${props.roomCode}/`, {
          method: "PATCH",
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({'votes_to_skip': votesToSkip, 'guest_can_pause': guestCanPause, 'code':props.roomCode})
          //body: JSON.stringify({'votes_to_skip': votesToSkip, 'guest_can_pause': guestCanPause, 'code':"props.roomCode"})
      })
      .then((response) => {
        if (response.ok){
          setSuccessMsg("Success");
        }
      })
      .catch((error) => {
        setErrorMsg(error);
      })
    }

    return (
        <Grid container spacing={1}>
          
        {successMsg && <Grid item xs={12} align="center">
          <Alert severity="success">Successfully Edited</Alert>
        </Grid>}
        {errorMsg && <Grid item xs={12} align="center">
          <Alert severity="error">You Don't Have The Authority To Edit This Room {errorMsg}</Alert>
        </Grid>}
        <Grid item xs={12} align="center">
          <Typography component="h4" variant="h4">
            {editing ? "Updata Room" : "Create A Room"}
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <FormControl component="fieldset">
            <FormHelperText>
              <div align="center">Guest Control of Playback State</div>
            </FormHelperText>
            <RadioGroup
              row
              defaultValue={guestCanPause.toString()}
              onChange={(e) => handleGuestCanPauseChange(e)}
            >
              <FormControlLabel
                value="true"
                control={<Radio color="primary" />}
                label="Play/Pause"
                labelPlacement="bottom"
              />
              <FormControlLabel
                value="false"
                control={<Radio color="secondary" />}
                label="No Control"
                labelPlacement="bottom"
              />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12} align="center">
          <FormControl>
            <TextField
              required={true}
              type="number"
              onChange={(e) => handleVotesChange(e)}
              defaultValue={votesToSkip}
              inputProps={{
                min: 1,
                style: { textAlign: "center" },
              }}
            />
            <FormHelperText>
              <div align="center">Votes Required To Skip Song</div>
            </FormHelperText>
          </FormControl>
        </Grid>
        {
          editing && 
          <Grid item xs={12} align="center">
            <Button
              color="primary"
              variant="contained"
              onClick={handleRoomUpdate}
            >
              Update Room
            </Button>
          </Grid> 
        }
        {
          !editing && 
          <Grid item xs={12} align="center">
            <Button
              color="primary"
              variant="contained"
              onClick={handleRoomButtonPressed}
            >
              Create A Room
            </Button>
          </Grid>
        }
  
        {!editing && <Grid item xs={12} align="center">
          <Button color="secondary" variant="contained" to="/" component={Link}>
            Back
          </Button>
        </Grid>
        }
      </Grid>
    );
}
 
export default Create;