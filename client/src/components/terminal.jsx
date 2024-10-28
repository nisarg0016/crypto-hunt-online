import React, { useState, useEffect, useRef, useContext } from "react";
import { AuthContext } from "../Context/AuthContext"
import FlagInput from "./flagInput";
import "./Terminal.css"; // Add basic styling
import axios from "axios"

const Terminal = ({
}) => {
    const [input, setInput] = useState(""); // Current input command
    const [history, setHistory] = useState([]); // History of all commands and their outputs
    const [commands, setCommands] = useState([]); // Command history for up/down arrow navigation
    const [currentCommandIndex, setCurrentCommandIndex] = useState(-1); // Tracks history navigation
    const [path, setPath] = useState(["."]);
    const [flag, setFlag] = useState("");
    const [level, setLevel] = useState(0);
    const terminalEndRef = useRef(null); // For scrolling to the bottom
    const { userDetails } = useContext(AuthContext)

    function createPathString() {
        let tempPath = "";
        for (let i = 1; i < path.length; i++) {
            tempPath = tempPath + "/";
            tempPath = tempPath + path[i];
        }

        return tempPath;
    }

    async function levelDetails() {
        try {
            const response = await axios.get(`http://localhost:8000/api/levels/get-level-details/${userDetails._id}`);
            setLevel(response.data.levelNo)
            setFlag(response.data.flag);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
    }

    useEffect(() => {
        //setDirectories();
        levelDetails();
    }, [])

    // Predefined fake command handler (You can expand this)
    const commandHandler = async (command) => {
        let output = '';
        command = command.trimStart();
        command = command.trimEnd(); // trim trailing whitespaces
        if (command == "clear" || command == "cls") {
            setHistory([]);
            return;
        }
        let args;
        const resp = await fetch("http://localhost:8000/execute", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                command: command,
                level: level,
                path: path,
                flag: flag
            })
        })
            .then((response) => {
                //console.log(response);
                return response.json().then(function (json) {
                    return response.ok ? json : Promise.reject(json);
                });
            })
            .then((json) => {
                //console.log(json);
                args = json;
                if (args.path !== null) {
                    setPath(args.path);
                }
            })
            .catch((error) => console.error(error));
        output = JSON.stringify(args);
        let outFinal = args.output;
        output = outFinal;
        if (args["output"] !== null) {
            setHistory([...history, { command, output }]);
        }
    };

    // Handle form submission (when the user presses Enter)
    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
            setCommands([...commands, input]); // Save command to history
            commandHandler(input); // Execute the command
            setInput(""); // Clear input
            setCurrentCommandIndex(-1); // Reset command index after command is entered
        }
    };

    // Handle Arrow Up/Down keys to navigate command history
    const handleKeyDown = (e) => {
        if (e.key === "ArrowUp") {
            if (currentCommandIndex > 0) {
                setCurrentCommandIndex(currentCommandIndex - 1);
                setInput(commands[currentCommandIndex - 1]);
            }
        } else if (e.key === "ArrowDown") {
            if (currentCommandIndex < commands.length - 1) {
                setCurrentCommandIndex(currentCommandIndex + 1);
                setInput(commands[currentCommandIndex + 1]);
            } else {
                setCurrentCommandIndex(-1);
                setInput("");
            }
        }
    };

    const logout = () => {
        window.location.href = 'http://localhost:8000/logout';
    }

    return (
        <div
            className="terminal-container"
            onKeyDown={handleKeyDown}
            tabIndex={0}
        >
            <button onClick={logout}>Logout</button>
            <div className="output-area">
                {history.map((entry, index) => (
                    <div key={index}>
                        <div className="command-line">$ {entry.command}</div>
                        {entry.output && (
                            <div className="command-output">{entry.output}</div>
                        )}
                    </div>
                ))}
                <div ref={terminalEndRef} />
            </div>
            <form onSubmit={handleSubmit}>
                <div className="input-line">
                    <span className="prompt">
                        ${path.length > 1 ? createPathString(path) : ' '}
                    </span>
                    <input
                        type="text"
                        className="input-field"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        autoFocus
                    />
                </div>
            </form>
            <FlagInput flag={flag} level={level}/>
        </div>
    );
};

export default Terminal;