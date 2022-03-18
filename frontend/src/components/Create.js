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

const Create = () => {
    const [votesToPass, setVotesToPass] = useState(2);
    const [guestCanPause, setGuestCanPause] = useState(false);
    const history = useHistory();
    const handleGuestCanPauseChange = (e) => {
        setGuestCanPause( e.target.value === "true" ? true : false);
    }

    const handleVotesChange = (e) => {
        setVotesToPass(e.target.value);
    }

    const handleRoomButtonPressed = () => {
        console.log(guestCanPause);
        console.log(votesToPass);
        fetch("http://127.0.0.1:8000/api/room/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'votes_to_skip': votesToPass, 'guest_can_pause': guestCanPause})
        })
        .then((response) => response.json())
        .then((data) => {
          console.log(`room/${data.code}/`);
          history.push(`/room/${data.code}/`)
        })
    }

    return (
        <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Typography component="h4" variant="h4">
            Create A Room
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <FormControl component="fieldset">
            <FormHelperText>
              <div align="center">Guest Control of Playback State</div>
            </FormHelperText>
            <RadioGroup
              row
              defaultValue="false"
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
              defaultValue={votesToPass}
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
        <Grid item xs={12} align="center">
          <Button
            color="primary"
            variant="contained"
            onClick={handleRoomButtonPressed}
          >
            Create A Room
          </Button>
        </Grid>
        <Grid item xs={12} align="center">
          <Button color="secondary" variant="contained" to="/" component={Link}>
            Back
          </Button>
        </Grid>
      </Grid>
    );
}
 
export default Create;