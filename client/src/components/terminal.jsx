import React, { useState, useEffect, useRef, useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import FlagInput from "./flagInput";
import "./Terminal.css"; // Add basic styling
import axios from "axios";

const Terminal = () => {
  const [input, setInput] = useState(""); // Current input command
  const [history, setHistory] = useState([]); // History of all commands and their outputs
  const [commands, setCommands] = useState([]); // Command history for up/down arrow navigation
  const [currentCommandIndex, setCurrentCommandIndex] = useState(-1); // Tracks history navigation
  const [path, setPath] = useState(["."]);
  const [flag, setFlag] = useState("");
  const [level, setLevel] = useState(0);
  const [dispLevel,setDispLevel] = useState(0);
  const terminalEndRef = useRef(null); // For scrolling to the bottom
  const { userDetails } = useContext(AuthContext);
  const inputRef = useRef(null); // Create a ref for the input field
  const rickRollRef = useRef(null); // Ref for rickroll audio
  const [rickRollPlaying, setRickRollPlaying] = useState(false);

  useEffect(() => {
    rickRollRef.current = new Audio("/lol.mp3"); // Ensure your sound file path is correct

  }, []);

  const playRickRoll = () => {
    if (!rickRollPlaying) {
      rickRollRef.current.currentTime = rickRollRef.current.currentTime; // Ensure we start from the current time
      rickRollRef.current
        .play()
        .then(() => {
          setRickRollPlaying(true);
          setTimeout(() => {
            rickRollRef.current.pause(); // Pause after 0.1 seconds
            // Do not reset currentTime to maintain the position
          }, 100); // Play for 100ms
        })
        .catch((error) => console.error("Playback failed:", error));
    } else {
      // If already playing, just play from the current time
      rickRollRef.current.play();
      setTimeout(() => {
        rickRollRef.current.pause(); // Pause after 0.1 seconds
      }, 100); // Play for another 100ms
    }
  };

  function createPathString() {
    let tempPath = "";
    for (let i = 1; i < path.length; i++) {
      tempPath += "/" + path[i];
    }
    return tempPath;
  }

  async function levelDetails() {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/levels/get-level-details/${userDetails._id}`
      );
      setDispLevel(response.data.levelNo);
      setLevel(response.data.level);
      setFlag(response.data.flag);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    levelDetails();
  }, []);

  // useEffect(() => {
  //   console.log(dispLevel,level);
  // },[dispLevel,level])

  const commandHandler = async (command) => {
    let output = "";
    command = command.trimStart().trimEnd(); // trim trailing whitespaces
    if (command === "clear" || command === "cls") {
      setHistory([]);
      setCommands([]);
      return;
    }
    let args;
    const resp = await fetch("http://localhost:8000/execute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        command: command,
        level: level,
        path: path,
        flag: flag,
      }),
    })
      .then((response) => {
        return response.json().then(function (json) {
          return response.ok ? json : Promise.reject(json);
        });
      })
      .then((json) => {
        //console.log("Server response:", json);
        args = json;
        if (args.path !== null) setPath(args.path);
        const outFinal = args.output;
          // Include the current path in the history
          setHistory([
            ...history,
            { command, output: outFinal, currentPath: createPathString() },
          ]);
      })
      .catch((error) => console.error(error));

    output = JSON.stringify(args);
    let outFinal = args.output;
    output = outFinal;
    if (args["output"] !== null) {
      setHistory([
        ...history,
        { command, output, currentPath: createPathString() },
      ]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setCommands([...commands, input]); // Save command to history
      commandHandler(input); // Execute the command
      setInput(""); // Clear input
      setCurrentCommandIndex(-1); // Reset command index after command is entered
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault(); // Disable the default cursor behavior
      if (e.key === "ArrowUp") {
        if (commands.length > 0) {
          if (currentCommandIndex === -1) {
            setCurrentCommandIndex(0);
            const commandToShow = commands[commands.length - 1]; // Get the last command
            setInput(commandToShow); // Update input
            setTimeout(() => {
              inputRef.current.setSelectionRange(
                commandToShow.length,
                commandToShow.length
              );
            }, 0);
          } else if (currentCommandIndex < commands.length - 1) {
            setCurrentCommandIndex(currentCommandIndex + 1);
            const commandToShow =
              commands[commands.length - 1 - currentCommandIndex - 1];
            setInput(commandToShow); // Update input
            setTimeout(() => {
              inputRef.current.setSelectionRange(
                commandToShow.length,
                commandToShow.length
              );
            }, 0);
          } else {
            playRickRoll();
          }
        } else {
          playRickRoll();
        }
      } else if (e.key === "ArrowDown") {
        if (currentCommandIndex > 0) {
          setCurrentCommandIndex(currentCommandIndex - 1);
          const commandToShow =
            commands[commands.length - 1 - currentCommandIndex + 1];
          setInput(commandToShow); // Update input
          setTimeout(() => {
            inputRef.current.setSelectionRange(
              commandToShow.length,
              commandToShow.length
            );
          }, 0);
        } else if (currentCommandIndex == -1) {
          playRickRoll();
        } else {
          setInput("");
          setCurrentCommandIndex(-1); // Reset index to indicate no command is selected
          setTimeout(() => {
            inputRef.current.setSelectionRange(0, 0); // Reset cursor position
          }, 0);
        } 
      }
    }
    else if ((e.ctrlKey || e.metaKey) && e.key === "f"){
        e.preventDefault();
        alert("Search functionality is disabled on this page.");
    }
  };

  const handleContainerClick = (e) => {
    if (!e.target.closest(".output-text")) {
      inputRef.current.focus();
    }
  };

  const logout = () => {
    window.location.href = "http://localhost:8000/logout";
  };

  return (
    <div
      className="terminal-container"
      onClick={handleContainerClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <pre className="title">
        {`
            CSES Not A Corporation. All nights reserved.
 ________  ________      ___    ___ ________  _________  ___  ________          ___  ___  ___  ___  ________   _________   
|\\   ____\\|\\   __  \\    |\\  \\  /  /|\\   __  \\|\\___   ___\\\\  \\|\\   ____\\        |\\  \\|\\  \\|\\  \\|\\  \\|\\   ___  \\|\\___   ___\\ 
\\ \\  \\___|\\ \\  \\|\\  \\   \\ \\  \\/  / | \\  \\|\\  \\|___ \\  \\_\\ \\  \\ \\  \\___|        \\ \\  \\\\\\  \\ \\  \\\\\\  \\ \\  \\\\ \\  \\|___ \\  \\_| 
 \\ \\  \\    \\ \\   _  _\\   \\ \\    / / \\ \\   ____\\   \\ \\  \\ \\ \\  \\ \\  \\            \\ \\   __  \\ \\  \\\\\\  \\ \\  \\\\ \\  \\   \\ \\  \\  
  \\ \\  \\____\\ \\  \\\\  \\|   \\/  /  /   \\ \\  \\___|    \\ \\  \\ \\ \\  \\ \\  \\____        \\ \\  \\ \\  \\ \\  \\\\\\  \\ \\  \\\\ \\  \\   \\ \\  \\ 
   \\ \\_______\\ \\__\\\\ _\\ __/  / /      \\ \\__\\        \\ \\__\\ \\ \\__\\ \\_______\\       \\ \\__\\ \\__\\ \\_______\\ \\__\\\\ \\__\\   \\ \\__\\
    \\|_______|\\|__|\\|__|\\___/ /        \\|__|         \\|__|  \\|__|\\|_______|        \\|__|\\|__|\\|_______|\\|__| \\|__|    \\|__|
                       \\|___|/                                                                                             
                                                                                                                           
                                                                                                                           
          `}
      </pre>
      <button onClick={logout}>Logout</button>
      <h1>Level number: {dispLevel}</h1>
      <div className="output-area">
        {history.map((entry, index) => (
          <div key={index}>
            <div className="command-line">
              cses@cryptic:
              <span className="path-color">~{entry.currentPath}$</span>{" "}
              {entry.command}
            </div>
            <div className="command-output">
              {(Array.isArray(entry.output)
                ? entry.output
                : [entry.output]
              ).map((item, idx) => {
                if (typeof item === "object" && item !== null) {
                  return (
                    <span
                      key={idx}
                      className={
                        item.type === "dir" ? "dir-color" : "file-color"
                      }
                    >
                      {item.name || "Unnamed"}{" "}
                    </span>
                  );
                } else {
                  return <span className="output-text" key={idx}>{item} </span>;
                }
              })}
            </div>
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>

      <form onSubmit={handleSubmit}>
        <div className="input-line">
          <span className="prompt">
            cses@cryptic:
            <span className="path-color">
              ~{path.length > 1 ? createPathString(path) : ""}$
            </span>
          </span>
          <input
            type="text"
            ref={inputRef}
            className="input-field"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoFocus
          />
        </div>
      </form>
      <FlagInput flag={flag} level={dispLevel} />
    </div>
  );
};

export default Terminal;
