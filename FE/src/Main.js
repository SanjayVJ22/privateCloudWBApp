import React, { useEffect, useRef, useState } from "react";
import DrawingCanvas from "./DrawingCanvas";

const Main = ({ userNo, socket, setUsers, setUserNo }) => {
  const canvasRef = useRef(null);
  const ctx = useRef(null);
  const [color, setColor] = useState("#000000");
  const [elements, setElements] = useState([]);
  const [history, setHistory] = useState([]);
  const [tool, setTool] = useState("pencil");

  useEffect(() => {
    socket.on("message", (data) => {
      console.log(" message got effected"+data.message)
     // toast.info(data.message);
    });
  }, []);
  useEffect(() => {
    socket.on("users", (data) => {
      setUsers(data);
      setUserNo(data.length);
    });
  }, []);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    setElements([]);
  };
  const undo = () => {
    setHistory((prevHistory) => [
      ...prevHistory,
      elements[elements.length - 1],
    ]);
    setElements((prevElements) =>
      prevElements.filter((ele, index) => index !== elements.length - 1)
    );
  };
  const redo = () => {
    setElements((prevElements) => [
      ...prevElements,
      history[history.length - 1],
    ]);
    setHistory((prevHistory) =>
      prevHistory.filter((ele, index) => index !== history.length - 1)
    );
  };
  
  return (
    <div className="container-fluid">
      <div className="row">
      <header style={{textAlign:'center',background:'blue',height:50}}><h1>WHITEBOARD</h1></header><br/><br/>

        <hr/>
      </div>
      <div className="row justify-content-center align-items-center text-center py-2">
        <div className="col-3">
          
        </div>
        <div >
          <div >
            <button value="pencil" id="pencil" readOnly={true} checked={tool === "pencil"} onClick={(e) => {alert("YOU HAVE SELECTED PENCIL SKETCH");setTool(e.target.value)}} name="tools" class='btn btn-info'>FREE SKETCH</button>
            <button style={{marginLeft:60}} value="line" id="line" readOnly={true} checked={tool === "line"} onClick={(e) => {alert("YOU HAVE SELECTED LINE");setTool(e.target.value)}} name="tools" class='btn btn-success'>LINE</button>
            <button style={{marginLeft:60}} value="rect" id="rect" readOnly={true} checked={tool === "rect"} onClick={(e) => {{alert("YOU HAVE SELECTED RECTANGLE");setTool(e.target.value)}}} name="tools" class='btn btn-dark'>Rectangle</button>
          </div>
         
         
        </div>
        
        
         
        <div className="col-md-1">
          <div className="color-picker d-flex align-items-center justify-content-center">
            <input
              style={{marginTop:40}}
              type="button"
              className="btn btn-primary"
              value="REMOVE"
              onClick={clearCanvas}
            />
             
             <input
              style={{marginTop:40,marginLeft:20}}
              type="button"
              value="UNDO"
              className="btn btn-warning"
              disabled={elements.length === 0}
              onClick={() => undo()}
            />
           <input
              style={{marginTop:40,marginLeft:20}}
              type="button"
              value="REDO"
              className="btn btn-primary"
              disabled={history.length < 1}
              onClick={() => redo()}
            />
          
          </div>
        </div>
      </div>
      <div className="row">
        <DrawingCanvas
          canvasRef={canvasRef}
          ctx={ctx}
          color={color}
          setElements={setElements}
          elements={elements}
          tool={tool}
          socket={socket}
        />
      </div>
    </div>
  );
};

export default Main;
