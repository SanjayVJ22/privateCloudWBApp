import React, { useEffect, useRef } from "react";

const Jionee = ({ userNo, socket, setUsers, setUserNo }) => {
  const test = useRef(null);
  useEffect(() => {
    socket.on("message", (data) => {
      alert(data.message)
    });
  }, []);
  useEffect(() => {
    socket.on("users", (data) => {
      setUsers(data); 
      setUserNo(data.length);
    });
  }, []);
  useEffect(() => {
    socket.on("img", (data) => {
      test.current.src = data;
    });
  }, []);
  return (
    <div className="container-fluid">
      <div className="row pb-2">
      <header style={{textAlign:'center',background:'blue',height:50}}><h1>WHITEBOARD</h1></header><br/><br/>

        
      </div>
      <div className="row mt-5">
        <div
          className="col-md-8 overflow-hidden border border-dark px-0 mx-auto
          mt-3"
          style={{ height: "350px" }}
        >
          <img className="w-100 h-100" ref={test} src="" alt="Board Is Empty" />
        </div>
      </div>
    </div>
  );
};

export default Jionee;
