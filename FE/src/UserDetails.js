import React, { useRef } from "react";
import { Socket } from "socket.io-client";

const UserDetails = ({ users, user, socket }) => {
  const ddd = useRef(null);

  const openmmm = () => {
    ddd.current.style.left = 0;
  };
  const closemmm = () => {
    ddd.current.style.left = -100 + "%";
  };
  return (
    < div class='col-3'>
      <button
        className="btn btn-secondary "
        onClick={openmmm}
        style={{ position: "absolute", top: "15%", left: "5%" }}
      >
        Users - {users.length}
      </button>
      <div
        className="position-fixed h-100 bg-primary"
        ref={ddd}
        style={{
          width: "150px",
          left: "-100%",
          transition: "0.3s linear",
          zIndex: "9999",
        }}
      >
        <button
          className="btn btn-block border-0 form-control rounded-0 btn-light"
          onClick={closemmm}
        >
          <h5>X</h5>
        </button>
        <div className="w-100 mt-5">
          {users.map((usr, index) => (
            <p key={index} className="text-white text-center py-2">
              {usr.username}
              {usr.id === socket.id && " - *"}
            </p>
          ))}
        </div>
      </div>
      
    </div>
    
  );
};

export default UserDetails;
