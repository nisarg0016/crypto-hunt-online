import React, { useState, useEffect, useRef } from 'react';
import './Terminal.css'; // Add basic styling

const Terminal = ({commandsConfig, levelNumber, onSuccess, onFailure, fileSystem}) => {
  const [input, setInput] = useState(''); // Current input command
  const [history, setHistory] = useState([]); // History of all commands and their outputs
  const [commands, setCommands] = useState([]); // Command history for up/down arrow navigation
  const [currentCommandIndex, setCurrentCommandIndex] = useState(-1); // Tracks history navigation
  const [directories, setDirectories] = useState(['.']); /// Directory structure
  const [path, setPath] = useState('');
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
  }

  const isFile = (name) => {
    return name.includes('.');
  }

  const changeDir = (command) => {
      let output = '';
      if (command == '..') {
          if (directories.length == 1) {
              output = 'Illegal operation!';
          } else {
              const tempDirectories = [...directories];
              tempDirectories.pop();
              setDirectories(tempDirectories);
          }
      } else {
          const currentDir = getCurrentDirectory();

          if (isFile(command)) {
            output = 'Cannot cd into a file';
          } else if (currentDir && currentDir[command]) {
            const tempDirectories = [...directories];
            tempDirectories.push(command);
            setDirectories(tempDirectories);
          } else {
            output = `Directory not found: ${command}`;
          }
      }

      if (output) {
        setHistory([...history, {command : `cd ${command}`, output}]);
      }
  };


  useEffect(() => {
    let tempPath = '';
    for (let i = 1; i < directories.length; i++) {
        tempPath = tempPath + '/';
        tempPath = tempPath + directories[i];
    }

    setPath(tempPath);
  }, [directories]);

  const listDir = () => {
    const currentDir = getCurrentDirectory();
    if (!currentDir) return 'Error: Directory not found';

    const output = Object.keys(currentDir).join(' '); 
    return output;
  };
  // Predefined fake command handler (You can expand this)
  const commandHandler = (command) => {
    let output = '';
    //const normalizedCommand = command.trim().toLowerCase();

    command = command.trimStart();
    command = command.trimEnd(); // trim trailing whitespaces
    if (command == 'clear') {
      setHistory([]);
      return;
    }

    //console.log(command);
    if (command == 'ls') {
        output = listDir();
        setHistory([...history, { command, output }]);
        return;
    }

    const parts = command.trim().split(' ');
    if (parts[0] == 'cd' && parts[1] != undefined) {
        console.log(parts[1]);
        changeDir(parts[1]);
        return;
    }

    let cmdText = parts[0];
    let file = parts[1];

    if (commandsConfig[cmdText]) {
      output = commandsConfig[cmdText](file);
      if (onSuccess && output.toLowerCase().includes('flag')) {
        onSuccess(); // Notify the parent of success when the flag is found
      }
    } else {
      output = `Command not found/used/incorrect usage: ${command}`;
      if (onFailure) {
        onFailure(); // Notify the parent of incorrect command if needed
      }
    }

    setHistory([...history, { command, output }]);
  };

  // Handle form submission (when the user presses Enter)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setCommands([...commands, input]); // Save command to history
      commandHandler(input); // Execute the command
      setInput(''); // Clear input
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
    if (e.key === 'ArrowUp') {
      if (currentCommandIndex > 0) {
        setCurrentCommandIndex(currentCommandIndex - 1);
        setInput(commands[currentCommandIndex - 1]);
      }
    } else if (e.key === 'ArrowDown') {
      if (currentCommandIndex < commands.length - 1) {
        setCurrentCommandIndex(currentCommandIndex + 1);
        setInput(commands[currentCommandIndex + 1]);
      } else {
        setCurrentCommandIndex(-1);
        setInput('');
      }
    }
  };

  return (
    <div className="terminal-container" onKeyDown={handleKeyDown} tabIndex={0}>
      <div className="output-area">
        {history.map((entry, index) => (
          <div key={index}>
            <div className="command-line">$ {entry.command}</div>
            {entry.output && <div className="command-output">{entry.output}</div>}
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>
      <form onSubmit={handleSubmit}>
        <div className="input-line">
          <span className="prompt">${(directories.length === 1) ? ' ' : path}</span>
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
