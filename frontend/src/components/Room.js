import { Button } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";

const Room = () => {

    const history = useHistory();
    const { room_code } = useParams();
    const [room, setRoom] = useState({});

    useEffect( ()=>{
        fetch(`http://127.0.0.1:8000/api/room/${room_code}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then((response) => {
            if (response.ok){
                return response.json();
            }
        })
        .then((data)=>{
            //console.log("room load: ", data)
            setRoom(data);
        })
    }, [])

    const handleLeave = ()=>{
        console.log("handleLeave");
        fetch("http://127.0.0.1:8000/api/user-leave-room/", {
            method:"POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'code': room_code})
        })
        .then((response)=> {
            if (response.ok){
                setRoom({});
                history.push('/');
            }
            return response.json();
        })
        .then((data) => {
            console.log(data);
        })
    }

    return (
        <div>
            <h3>{room.code}</h3>
            <p>Votes To Skip: {room.votes_to_skip}</p>
            <p>Controll Allowed: {room.guest_can_pause ? "true" : "false"}</p>
            <p>Owner: {room.is_host ? "true":"false"}</p>
            <Button color="danger" onClick={handleLeave}>
                Leave
            </Button>
        </div>
    );
}
 
export default Room;