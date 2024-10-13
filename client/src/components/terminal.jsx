import React, { useState, useEffect, useRef } from "react";
import "./Terminal.css"; // Add basic styling

const Terminal = ({
    commandsConfig,
    levelNumber,
    onSuccess,
    onFailure,
    fileSystem,
    sortedFiles,
}) => {
    const [input, setInput] = useState(""); // Current input command
    const [history, setHistory] = useState([]); // History of all commands and their outputs
    const [commands, setCommands] = useState([]); // Command history for up/down arrow navigation
    const [currentCommandIndex, setCurrentCommandIndex] = useState(-1); // Tracks history navigation
    const [directories, setDirectories] = useState(["."]); /// Directory structure
    const [path, setPath] = useState("");
    const terminalEndRef = useRef(null); // For scrolling to the bottom

    const getCurrentDirectory = () => {
        let currentDir = fileSystem;
        for (let i = 1; i < directories.length; i++) {
            currentDir = currentDir[directories[i]];
            if (!currentDir) {
                return null;
            }
        }

        return currentDir;
    };
    
    const isFile = (name) => {
        return name.includes(".");
    };

    const changeDir = (command) => {
        let output = "";
        if (command == "..") {
            if (directories.length == 1) {
                output = "Illegal operation!";
            } else {
                const tempDirectories = [...directories];
                tempDirectories.pop();
                setDirectories(tempDirectories);
            }
        } else {
            const currentDir = getCurrentDirectory();

            if (isFile(command)) {
                output = "Cannot cd into a file";
            } else if (currentDir && currentDir[command]) {
                const tempDirectories = [...directories];
                tempDirectories.push(command);
                setDirectories(tempDirectories);
            } else {
                output = `Directory not found: ${command}`;
            }
        }

        if (output) {
            setHistory([...history, { command: `cd ${command}`, output }]);
        }
    };

    useEffect(() => {
        let tempPath = "";
        for (let i = 1; i < directories.length; i++) {
            tempPath = tempPath + "/";
            tempPath = tempPath + directories[i];
        }

        setPath(tempPath);
    }, [directories]);

    const listDir = (parts) => {
        const currentDir = getCurrentDirectory();
        let sort = 0;
        let rev = 0;
        for (let i = 1; i < parts.length; i++) {
        if (parts[i] == '-S') {
            sort = 1;
        }

          if (parts[i] == '-r') {
            rev = 1;
        }
        }

        let output = '';
        if (sort === 0) {
        output = Object.keys(currentDir).join(' ');
        } else if (sort && !rev) {
        for (let i = sortedFiles.length - 1; i >= 0; i--) {
            output += `${sortedFiles[i].fileName} \n`;  
        }
        } else if (sort && rev) {
        for (let i = 0; i < sortedFiles.length; i++) {
            output += `${sortedFiles[i].fileName} \n`;  
        }
        }
        
        return output;
    };
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
        const resp = await fetch("http://localhost:12000/parse", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                command: command
            })
        })
            .then((response) => {
                console.log(response);
                return response.json().then(function (json) {
                    return response.ok ? json : Promise.reject(json);
                });
            })
            .then((json) => {
                console.log(json);
                args = json;
            })
            .catch((error) => console.error(error));
        output = JSON.stringify(args);
        setHistory([...history, { command, output }]);
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

    // Scroll to the bottom of the terminal
    /*
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);
  */
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

    return (
        <div
            className="terminal-container"
            onKeyDown={handleKeyDown}
            tabIndex={0}
        >
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
                        ${directories.length === 1 ? " " : path}
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
        </div>
    );
};

export default Terminal;