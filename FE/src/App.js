import React, { useEffect, useState } from "react";
import { json } from "react-router-dom";
import io from "socket.io-client";
import Main from "./Main";
import UserDetails from "./UserDetails";
import Jionee from "./Jionee";

const server = "*****";
const connectionOptions = {
  "force new connection": true,
  reconnectionAttempts: "Infinity",
  timeout: 10000,
  transports: ["websocket"],
};

const socket = io(server, connectionOptions);

const App = () => {
  const [userNo, setUserNo] = useState(0);
  const [roomJoined, setRoomJoined] = useState(false);
  const [user, setUser] = useState({});
  const [users, setUsers] = useState([]);
  var [createfunc,setCreateFunc] =React.useState(false)
  var [enterfunc,setEnterfunc] =React.useState(false)
  var [userNm ,setUserNm] =React.useState()
  var [roomId,setRoomId] =React.useState();

  function createRm(){
    setCreateFunc(true)
    setEnterfunc(false)
  }
  function enterRoom(){
    setEnterfunc(true)
    setCreateFunc(false)
  
  }
  function getUserNm(e){
    setUserNm(e.currentTarget.value)
  }
  function getRoomId(e){
    setRoomId(e.currentTarget.value)

  }
  const vvv = (e) => {
    e.preventDefault();
   if(roomId ==null || userNm == null){
    alert('DETAILS CANNOT BE EMPTY')
   }
   else{
    setUser({
      roomId:roomId,
      userId: roomId,
      userName: userNm,
      host: true,
      presenter: true,
    });
    console.log(user)
    setRoomJoined(true);
  }
  };
  const ggg = (e) => {
    e.preventDefault();
    if(roomId ==null || userNm == null){
      alert('DETAILS CANNOT BE EMPTY')
     }
    else{

    setUser({
      roomId: roomId,
      userId: roomId,
      userName: userNm,
      host: false,
      presenter: false,
    });
    console.log(user)
    setRoomJoined(true);
  }
  };
 
  useEffect(() => {
    if (roomJoined) {
      socket.emit("testJ", user);
    }
  }, [roomJoined]);

  return (
    <div>
      { 
        roomJoined ? (
        <div>
<UserDetails users={users} user={user} socket={socket} />
          {user.presenter ? (
            <Main
              userNo={userNo}
              user={user}
              socket={socket}
              setUsers={setUsers}
              setUserNo={setUserNo}
            />
          ) : (
            <Jionee
              userNo={userNo}
              user={user}
              socket={socket}
              setUsers={setUsers}
              setUserNo={setUserNo}
            />
          )}
        </div>) : (
        <div>
 <header style={{textAlign:'center',background:'blue',height:50}}><h1>WHITEBOARD</h1></header><br/><br/>
      <div class='row'>
     <div class='col-3'>
      <button onClick={enterRoom} class='btn btn-primary'>ENTER ROOM</button> <br/>
      <br/>
      <button onClick={createRm} class='btn btn-primary'>CREATE ROOM</button></div>
      <div class='col-7'>
         { enterfunc ? (
      <div >
        

       
       <input onChange={getUserNm} type='text' placeholder="USERNAME"/><br/><br/>
       <input onChange={getRoomId} type='text' placeholder="RoomID"/><br/><br/>
       <button onClick={ggg} class='btn btn-warning'>ENTER</button>
      
      </div>) : (<div></div>)
}
{ createfunc ? (
      <div >
        

       
       <input onChange={getUserNm}  type='text' placeholder="USERNAME"/><br/><br/>
       <input onChange={getRoomId} type='text' placeholder="RoomID"/><br/><br/>
       <button onClick={vvv} class='btn btn-success'>CREATE</button>
      
      </div>) : (<div></div>)
}
</div>
      </div>
        </div>
        )
      }
     
    </div>
  )
};
export default App;
