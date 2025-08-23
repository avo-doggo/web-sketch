import '../Styles/Canvas.css'
import { preconnect } from "react-dom";
import React, {useRef, useEffect, useLayoutEffect, useState, act} from "react";
import rough from 'roughjs/bundled/rough.esm';
import getStroke from "perfect-freehand";
import PaintBrush from '../Images/PaintBrush.png';
import LineTool from '../Images/LineTool.png';
import SquareTool from '../Images/SquareTool.png';
import TextTool from '../Images/TextTool.png';
import PencilTool from '../Images/Penciltool.png';
import MoveTool from '../Images/MoveTool.png'

export function Canvas() {
const generator = rough.generator();

const createElement = (id, x1, y1, x2, y2, type) => {
  switch (type) {
    case "line":
    case "rectangle":
      const roughElement = type === "line" 
      ? generator.line(x1, y1, x2, y2, { stroke: color })
      : generator.rectangle(x1, y1, x2-x1, y2-y1, { stroke: color });
       return { id, layer: activeLayer, x1, y1, x2, y2, type, roughElement, color };
    case "pencil":
      //todo
     return { id, layer: activeLayer, type, color, points: [{ x: x1, y: y1 }] };
    case "text":
      return {id, type, x1, y1, x2, y2, text:""};
      default:
        throw new Error('Type not recognized: ${type}');
  }
  
};

const nearPoint = (x, y, x1, y1, name) => {
  return Math.abs(x - x1) < 5 && Math.abs(y - y1) < 5 ? name : null;
};

const onLine = (x1, y1, x2, y2, x, y, maxDistance = 1) => {
        const a = {x: x1, y: y1};
      const b = { x: x2, y: y2};
      const c = { x, y};
      const offset = distance(a, b) - (distance(a, c) + distance(b, c));
      return Math.abs(offset)< maxDistance ? "inside" : null;
};

const positionWithinElement = (x, y, element) => {
const {type, x1, x2, y1, y2} = element;
switch (type) {
    case "line":
      const on = onLine(x1, y1, x2, y2, x, y)
      const start = nearPoint(x, y, x1, y1, "start");
      const end = nearPoint(x, y, x2, y2, "end");
      return start || end || on;
    case "rectangle":
  const topLeft = nearPoint(x, y, x1, y1, "tl");
  const topRight = nearPoint(x, y, x2, y1, "tr");
  const bottomLeft = nearPoint(x, y, x1, y2, "bl");
  const bottomRight = nearPoint(x, y, x2, y2, "br");
  const inside = x >= x1 && x <= x2 && y >= y1 && y <= y2 ? "inside" : null;
  return topLeft || topRight || bottomLeft || bottomRight || inside;
    case "pencil":
      const betweenAnyPoint = element.points.some((point, index) => {
        const nextPoint = element.points[index + 1];
        if (!nextPoint) return false;
        return onLine(point.x, point.y, nextPoint.x, nextPoint.y, x, y, 5) !== null;
      })
    return betweenAnyPoint ? "inside" : null;
    case "text":
      return x >= x1 && x <= x2 && y >= y1 && y <= y2 ? "inside" : null;
  default:
      throw new Error('Type not recognized: ${type}')
  }
};

const distance = (a, b) => Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

const getElementAtPosition = (x, y, elements) => {
  return elements
    .map(element => ({ ...element, position: positionWithinElement(x, y, element) }))
    .find(element => element.position !== null);
};

const adjustElementCoordinates = element => {
  const { type, x1, y1, x2, y2 } = element;
  if (type === "rectangle") {
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);
    return { x1: minX, y1: minY, x2: maxX, y2: maxY };
  } else {
    if (x1 < x2 || (x1 === x2 && y1 < y2)) {
      return { x1, y1, x2, y2 };
    } else {
      return { x1: x2, y1: y2, x2: x1, y2: y1 };
    }
  }

};

const cursorForPosition = position => {
switch (position) {
  case "tl":
  case "br":
  case "start":
  case "end":
  return "nwse-resize";
  case "tr":
  case "bl":
  return "nesw-resize";
  default:
    return "move";
}
};

const resizedCoordinates = (clientX, clientY, position, coordinates) => {
  const { x1, y1, x2, y2 } = coordinates;
  switch (position) {
    case "tl":
    case "start":
      return { x1: clientX, y1: clientY, x2, y2 };
    case "tr":
      return { x1, y1: clientY, x2: clientX, y2 };
    case "bl":
      return { x1: clientX, y1, x2, y2: clientY };
    case "br":
    case "end":
      return { x1, y1, x2: clientX, y2: clientY };
    default:
      return null; //should not really get here...
  }
};

const useHistory = (initialState) => {
  const[index, setIndex] = useState(0);
  const [history, setHistory] = useState([initialState]);

  const setState = (action, overwrite = false)=>{
    const newState = typeof action === "function" ? action(history[index]) : action;
    if (overwrite) {
      const historyCopy = [...history];
      historyCopy[index] = newState;
      setHistory(historyCopy);
    } else {
      const updatedState = [...history].slice(0, index + 1);
      setHistory([...updatedState, newState]);
      setIndex(prevState => prevState +1);
    }
  };

 const undo = () => index> 0 && setIndex(prevState => prevState - 1);
 const redo = () => index < history.length - 1 && setIndex(prevState => prevState + 1);
  
  return [history[index], setState, undo, redo];
};

const getSvgPathFromStroke = (stroke) => {
 if (!getStroke.length) return ""

    const d = stroke.reduce(
      (acc, [x0, y0], i, arr) => {
        const [x1, y1] = arr[(i + 1) % arr.length]
        acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1)/ 2)
        return acc
      },
      ["M", ...stroke[0], "Q"]
    )

  d.push("Z")
  return d.join(" ")
}
const drawElement = (roughCanvas, context, element) => {
switch (element.type) {
  case "line":
  case "rectangle":
    roughCanvas.draw(element.roughElement);
    break;
  case "pencil":
      context.fillStyle = element.color;
  const stroke = getSvgPathFromStroke(getStroke(element.points));
  context.fill(new Path2D(stroke));
    break;
    case "text":
      context.textBaseline = "top";
      context.font = '24px sans-serif';
      context.fillText(element.text, element.x1, element.y1);
      break;
  default:
    throw new Error('Type not recognized: ${element.type}')
}
};

const adjustmentRequired = type => ['line', 'rectangle'].includes(type);

const usePressedKeys = () => {
  const [pressedKeys, setPressedKeys] = useState(new Set());

  useEffect(() => {
    const handleKeyDown = event => {
      setPressedKeys(prevKeys => new Set(prevKeys).add(event.key));
    };

    const handleKeyUp = event => {
      setPressedKeys(prevKeys => {
        const updatedKeys = new Set(prevKeys);
        updatedKeys.delete(event.key);
        return updatedKeys;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return pressedKeys;
};


  const [elements, setElements, undo, redo] = useHistory([]);
  const [action, setAction] = useState("none");
  const [tool, setTool] = useState("pencil");
  const [selectedElement, setSelectedElement] = useState(null);
  const [panOffset, setPanOffset] = React.useState({x: 0, y: 0});
  const [startPanMousePosition, setStartPanMousePosition] = React.useState({x: 0, y: 0});
  const [scale, setScale] = React.useState(1);
  const [scaleOffset, setScaleOffset] = React.useState({x: 0, y: 0});
  const textAreaRef = useRef();
  const pressedKeys = usePressedKeys();
  const [layers, setLayers] = useState([{ id: 0, name: "Layer 1" }]);
  const [activeLayer, setActiveLayer] = useState(0);
  const [color, setColor] = useState("#000000");


 useLayoutEffect(() => {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    const roughCanvas = rough.canvas(canvas);

    context.clearRect(0, 0, canvas.width, canvas.height);

    const scaleWidth = canvas.width * scale;
    const scaleHeight = canvas.height * scale;
    const scaleOffsetX = (scaleWidth - canvas.width) / 2;
    const scaleOffsetY = (scaleHeight - canvas.height) / 2;
    setScaleOffset({ x: scaleOffsetX, y: scaleOffsetY});
    
    context.save();
    context.translate(panOffset.x * scale - scaleOffsetX, panOffset.y * scale - scaleOffsetY);
    context.scale(scale, scale);


  elements.forEach (element => {
    if(action === "writing" && selectedElement?.id === element.id) return;
    drawElement(roughCanvas, context, element)
 });
 context.restore();
}, [elements, action, selectedElement, panOffset, scale]);

  useEffect(() => {
    const undoRedoFunction = event => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "z" ) 
        {
        if (event.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
    };

    document.addEventListener("keydown", undoRedoFunction);
    return () => {
      document.removeEventListener("keydown", undoRedoFunction);
    };
  }, [undo, redo]);

  useEffect(() => {
    const panOrZoomFunction = event => {
      if (pressedKeys.has("meta") || pressedKeys.has("[")) onZoom(event.deltaY * -0.001);
     else setPanOffset(prevState => ({
      x :prevState.x - event.deltaX,
      y: prevState.y - event.deltaY
     }));

    };

    document.addEventListener("wheel", panOrZoomFunction);
    return () => {
      document.removeEventListener("wheel", panOrZoomFunction);
    };
  }, [pressedKeys]);

  useEffect(() => {
    const textArea = textAreaRef.current;
    if (action === "writing") {
      setTimeout(() => {
        textArea.focus();
        textArea.value = selectedElement.text;
      }, 0);
    }
  }, [action, selectedElement]);

const updateElement = (id, x1, y1, x2, y2, type, options) => {
const elementsCopy = [...elements];

switch (type) {
    case "line":
    case "rectangle":
      elementsCopy[id] = createElement(id, x1, y1, x2, y2, type);
    break;
    case "pencil":
      elementsCopy[id].points = [...elementsCopy[id].points, {x: x2, y: y2}];
      break;
    case "text":
       const textWidth = document
          .getElementById("canvas")
          .getContext("2d")
          .measureText(options.text).width;
        const textHeight = 24;
        elementsCopy[id] = {
          ...createElement(id, x1, y1, x1 + textWidth, y1 + textHeight, type),
          text: options.text,
        };
        break;
      default:
        throw new Error(`Type not recognised: ${type}`);
    }
  setElements(elementsCopy, true);
}

const getMouseCoordinates = event => {
  const canvas = document.getElementById("canvas");
  const rect = canvas.getBoundingClientRect();

  // mouse position relative to canvas top-left
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  // adjust for pan/zoom
  const clientX = (x - panOffset.x * scale + scaleOffset.x) / scale;
  const clientY = (y - panOffset.y * scale + scaleOffset.y) / scale;

  return { clientX, clientY };
};


const handleMouseDown = event => {
if (action === "writing") return;

  const { clientX, clientY} = getMouseCoordinates(event);

  if(event.button === 1 || pressedKeys.has(" ")){
    setAction("panning");
    setStartPanMousePosition({x: clientX, y: clientY});
    return;
  }

  if( tool === "selection") {
    const element = getElementAtPosition(clientX, clientY, elements);
    if(element) {
      if(element.type === "pencil") {
        const xOffsets = element.points.map(point => clientX - point.x);
        const yOffsets = element.points.map(point => clientY - point.y);
        setSelectedElement({ ...element, xOffsets, yOffsets });
      } else {
      const offsetX = clientX - element.x1;
      const offsetY = clientY - element.y1;
      setSelectedElement({ ...element, offsetX, offsetY });
      }
      setElements(prevState => prevState);
    

    if (element.position === "inside") {
          setAction("moving");
        } else {
          setAction("resizing");
        }
      }
    } else {
      const id = elements.length;
      const element = createElement(id, clientX, clientY, clientX, clientY, tool);
      setElements(prevState => [...prevState, element]);
      setSelectedElement(element);
  
  setAction(tool === "text" ? "writing": "drawing");
  }
};

const handleMouseMove = event => {
const { clientX, clientY} = getMouseCoordinates(event);

if (action === "panning") {
  const deltaX = clientX - startPanMousePosition.x;
  const deltaY = clientY - startPanMousePosition.y;
  setPanOffset({
    x: panOffset.x + deltaX,
    y: panOffset.y + deltaY,
  });
  return;
}

  if(tool === "selection"){
    const element  = getElementAtPosition(clientX, clientY, elements);
    event.target.style.cursor = element
    ? cursorForPosition(element.position)
    : "default";
  }

  if(action === "drawing") {
  const index = elements.length - 1;
  const { x1, y1} = elements[index];
  updateElement(index, x1, y1, clientX, clientY, tool);

  } else if (action === "moving") {
    if(selectedElement.type === "pencil"){
      const newPoints = selectedElement.points.map((_, index) => ({
          x: clientX - selectedElement.xOffsets[index],
          y: clientY - selectedElement.yOffsets[index]
        
      }))
     const elementsCopy = [...elements];
elementsCopy[selectedElement.id] = {
  ...elementsCopy[selectedElement.id],
  points: newPoints,
};
setElements(elementsCopy, true);
    } else {
    const {id, x1, x2, y1, y2, type, offsetX, offsetY} = selectedElement;
    const width = x2- x1;
    const height = y2 - y1;
    const newX1 = clientX - offsetX;
    const newY1 = clientY - offsetY;
    const options = type === "text" ? {text : selectedElement.text} : {};
    updateElement(id, newX1, newY1, newX1 + width, newY1 + height, type);
    }
  } else if (action === "resizing") {
    const {id,  type, position, ...coordinates } = selectedElement;
    const {x1, y1, x2, y2} = resizedCoordinates(clientX, clientY, position, coordinates);
    updateElement(id, x1, y1, x2, y2, type);
  }
};

const handleMouseUp = event => {
  const { clientX, clientY} = getMouseCoordinates(event);

  if(selectedElement){
    if(
      selectedElement.type === "text" &&
      clientX - selectedElement.offsetX === selectedElement.x1 &&
      clientY - selectedElement.offsetY === selectedElement.y1
    ) {
      setAction("writing");
      return;
    }

  const index = selectedElement.id;
  const { id, type} = elements[index];
  if((action === "drawing" || action === "resizing") && adjustmentRequired(type)){
    const {x1, y1, x2, y2} = adjustElementCoordinates(elements[index]);
    updateElement(id, x1, y1, x2, y2, type);
  }
}
 
if (action === "writing") return;


  setAction("none");
  setSelectedElement(null);
};

  const handleBlur = event => {
    const { id, x1, y1, type } = selectedElement;
    setAction("none");
    setSelectedElement(null);
    updateElement(id, x1, y1, null, null, type, { text: event.target.value });
  };

  const onZoom = (delta) => {
    setScale(prevState => Math.min(Math.max (prevState + delta, 0.1), 20));
  }

  const handleSave = () => {
  const canvas = document.getElementById("canvas");

  //PNG snapshot 
  const dataUrl = canvas.toDataURL("image/png");

  //  JSON project data 
  // Replace `drawingData` with whatever you’re tracking in state (strokes, shapes, etc.)
 const projectData = {
  timestamp: Date.now(),
  elements, // save actual elements
};

  // Load existing works from sessionStorage
  const previousWorks = JSON.parse(sessionStorage.getItem("previousWorks") || "[]");

  // Add new work
  previousWorks.push({
    id: Date.now(),
    image: dataUrl,
    project: projectData,
  });

  // Save back
  sessionStorage.setItem("previousWorks", JSON.stringify(previousWorks));
};
const handleExport = () => {
  const canvas = document.getElementById("canvas");
  const dataUrl = canvas.toDataURL("image/png");

  const link = document.createElement("a");
  link.download = `canvas-${Date.now()}.png`;
  link.href = dataUrl;
  link.click();
};

return (
  <div className="canvas-layout">
    {/* Toolbar (left side) */}
    <div className="toolbar">
      <button
        className={tool === "selection" ? "active" : ""}
        onClick={() => setTool("selection")}
      >
        <img src={MoveTool} alt="Selection" />
      </button>
      <button
        className={tool === "line" ? "active" : ""}
        onClick={() => setTool("line")}
      >
        <img src={LineTool} alt="Line Tool" />
      </button>
      <button
        className={tool === "rectangle" ? "active" : ""}
        onClick={() => setTool("rectangle")}
      >
        <img src={SquareTool} alt="Square Tool" />
      </button>
      <button
        className={tool === "pencil" ? "active" : ""}
        onClick={() => setTool("pencil")}
      >
        <img src={PencilTool} alt="Pencil" />
      </button>
      <button
        className={tool === "text" ? "active" : ""}
        onClick={() => setTool("text")}
      >
        <img src={TextTool} alt="Text" />
      </button>
    </div>

    {/* Middle canvas area */}
    <div className="canvas-container">
      <canvas
        id="canvas"
        width={window.innerWidth * 0.6}   // only 60% width
        height={window.innerHeight * 0.9} // only 85% height
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        Canvas
      </canvas>

      {action === "writing" && (
        <textarea
          ref={textAreaRef}
          onBlur={handleBlur}
          style={{
            position: "absolute",
            top: (selectedElement.y1) * scale - 2 + panOffset.y * scale - scaleOffset.y,
            left: (selectedElement.x1) * scale + panOffset.x * scale - scaleOffset.x,
            font: `${24 * scale}px sans-serif`,
            background: "transparent",
            border: "none",
            outline: "none",
            resize: "none",
          }}
        />
      )}
    </div>

    {/* Right side panel (layers + save) */}
  <div className="right-panel">
    <input
  type="color"
  value={color}
  onChange={e => setColor(e.target.value)}
/>
  <h3>Layers</h3>
  <ul>
    {layers.map(layer => (
      <li key={layer.id}>
        <button
          style={{ fontWeight: activeLayer === layer.id ? "bold" : "normal" }}
          onClick={() => setActiveLayer(layer.id)}
        >
          {layer.name}
        </button>
        <button onClick={() => setLayers(layers.filter(l => l.id !== layer.id))}>
          ❌
        </button>
      </li>
    ))}
  </ul>
  <button
    onClick={() =>
      setLayers([...layers, { id: layers.length, name: `Layer ${layers.length + 1}` }])
    }
  >
    ➕ Add Layer
  </button>
   {/* Floating buttons */}
  <div className='saveButtons'
    style={{
        position: "absolute",
      top: 0,
      right: 200,
      width: "100%", // full width of container
      height: "50px", // adjust height as needed
      backgroundColor: "#161616",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end", // buttons on the right
      padding: "0 10px",
      zIndex: 10,
    }}
  >
    <button onClick={handleSave}>💾 Save JSON</button>
    <button onClick={handleExport}> 📁 Export PNG</button>
  </div>
</div>

    {/* Bottom-left undo/redo/zoom controls */}
    <div className="bottom-controls">
      <button onClick={() => onZoom(-0.1)}>-</button>
      <span style={{color: '#ccc'}} onClick={() => setScale(1)}>
        {new Intl.NumberFormat("en-GB", { style: "percent" }).format(scale)}
      </span>
      <button onClick={() => onZoom(0.1)}>+</button>
      <button onClick={undo}>Undo</button>
      <button onClick={redo}>Redo</button>
    </div>
  </div>
);
}