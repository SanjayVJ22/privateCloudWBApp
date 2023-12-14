import React, { useEffect, useLayoutEffect, useState } from "react";
import rough from "roughjs/bundled/rough.esm";

const roughGenerator = rough.generator();

const DrawingCanvas = ({
  canvasRef,
  ctx,
  strokeColor,
  setDrawingElements,
  drawingElements,
  selectedTool,
  socket,
}) => {
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.height = window.innerHeight * 2;
    canvas.width = window.innerWidth * 2;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    const context = canvas.getContext("2d");
    context.strokeWidth = 5;
    context.scale(2, 2);
    context.lineCap = "round";
    context.strokeStyle = strokeColor;
    context.lineWidth = 5;
    ctx.current = context;
  }, []);

  useEffect(() => {
    ctx.current.strokeStyle = strokeColor;
  }, [strokeColor]);

  const handleMouseDown = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;

    if (selectedTool === "pencil") {
      setDrawingElements((prevElements) => [
        ...prevElements,
        {
          offsetX,
          offsetY,
          path: [[offsetX, offsetY]],
          stroke: strokeColor,
          element: selectedTool,
        },
      ]);
    } else {
      setDrawingElements((prevElements) => [
        ...prevElements,
        { offsetX, offsetY, stroke: strokeColor, element: selectedTool },
      ]);
    }

    setIsDrawing(true);
  };

  useLayoutEffect(() => {
    const roughCanvas = rough.canvas(canvasRef.current);

    if (drawingElements.length > 0) {
      ctx.current.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
    }

    drawingElements.forEach((ele, i) => {
      if (ele.element === "rect") {
        roughCanvas.draw(
          roughGenerator.rectangle(
            ele.offsetX,
            ele.offsetY,
            ele.width,
            ele.height,
            {
              stroke: ele.stroke,
              roughness: 0,
              strokeWidth: 5,
            }
          )
        );
      } else if (ele.element === "line") {
        roughCanvas.draw(
          roughGenerator.line(ele.offsetX, ele.offsetY, ele.width, ele.height, {
            stroke: ele.stroke,
            roughness: 0,
            strokeWidth: 5,
          })
        );
      } else if (ele.element === "pencil") {
        roughCanvas.linearPath(ele.path, {
          stroke: ele.stroke,
          roughness: 0,
          strokeWidth: 5,
        });
      }
    });

    const canvasImage = canvasRef.current.toDataURL();
    socket.emit("given", canvasImage);
  }, [drawingElements]);

  const handleMouseMove = (e) => {
    if (!isDrawing) {
      return;
    }
    const { offsetX, offsetY } = e.nativeEvent;

    if (selectedTool === "rect") {
      setDrawingElements((prevElements) =>
        prevElements.map((ele, index) =>
          index === drawingElements.length - 1
            ? {
                offsetX: ele.offsetX,
                offsetY: ele.offsetY,
                width: offsetX - ele.offsetX,
                height: offsetY - ele.offsetY,
                stroke: ele.stroke,
                element: ele.element,
              }
            : ele
        )
      );
    } else if (selectedTool === "line") {
      setDrawingElements((prevElements) =>
        prevElements.map((ele, index) =>
          index === drawingElements.length - 1
            ? {
                offsetX: ele.offsetX,
                offsetY: ele.offsetY,
                width: offsetX,
                height: offsetY,
                stroke: ele.stroke,
                element: ele.element,
              }
            : ele
        )
      );
    } else if (selectedTool === "pencil") {
      setDrawingElements((prevElements) =>
        prevElements.map((ele, index) =>
          index === drawingElements.length - 1
            ? {
                offsetX: ele.offsetX,
                offsetY: ele.offsetY,
                path: [...ele.path, [offsetX, offsetY]],
                stroke: ele.stroke,
                element: ele.element,
              }
            : ele
        )
      );
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  return (
    <div
      className="col-md-8 overflow-hidden border border-dark px-0 mx-auto mt-3"
      style={{ height: "350px" }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <canvas ref={canvasRef} />
    </div>
  );
};

export default DrawingCanvas;
