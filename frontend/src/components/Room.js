import { Grid, Button } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import Create from "./Create";

const Room = () => {

    const history = useHistory();
    const { room_code } = useParams();
    const [room, setRoom] = useState({});
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(()=>{
        console.log("Room useEffect Here! 2");
        fetch(`https://spo-music-controller.herokuapp.com/api/room/${room_code}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then((response) => {
            if (response.ok){
                return response.json();
            }
            else {
                handleLeave();
                history.push('/');
            }
        })
        .then((data)=>{
            console.log("room load: ", data)
            setRoom(data);
        })
        .catch((error)=>{
            console.log(error);
            history.push('/');
        })
    }, [isUpdating])

    const handleLeave = async ()=> {
        console.log("handleLeave");
        await fetch("http://127.0.0.1:8000/api/user-leave-room/", {
            method:"POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'code': room_code})
        })
        .then((response)=> {
            if (response.ok){
                console.log("leave response here ! ", room);
                setRoom({});
                return history.push('/');
            }
            return response.json();
        }).catch((error) => {
            console.log(error);
            history.push('/');
        })
    }

    const openSettings = () => {
        setIsUpdating(true);
    }

    if (isUpdating) {
        return (
            <Grid container spacing={3}>
                <Grid item xs={12} align="center">
                    <Create 
                        editing={true}
                        votesToSkip={room.votes_to_skip}
                        guestCanPause={room.guest_can_pause}
                        roomCode={room.code}
                    />
                </Grid>
                <Grid item xs={12} align="center">
                    <Button color="secondary" onClick={() => {setIsUpdating(false)}} >Close</Button> 
                </Grid>
            </Grid>
        )
    }
    return (
        <div>
            <h3>{room.code}</h3>
            <p>Votes To Skip: {room.votes_to_skip}</p>
            <p>Controll Allowed: {room.guest_can_pause ? "true" : "false"}</p>
            <p>Owner: {room.is_host ? "true":"false"}</p>
            {room.is_host ? (
                <Button color="primary" onClick={openSettings}>
                    Settings
                </Button>
            )
            : (
                <div></div>
            )
            }
            <Button color="danger" onClick={handleLeave}>
                Leave
            </Button>
        </div>
    );
}
 
export default Room;