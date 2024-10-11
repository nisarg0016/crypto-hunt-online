import React from 'react';
import Terminal from '../terminal';

const LevelOne = ({flag}) => {
  // Define the commands for Level 1
  //let flag = "Example flag level 1";
  const fileSystem = {
      'flag.txt': `The flag is #FLAG{${flag}}$`,
      'README': `Welcome to CryptoHunt:
      CryptoHunt is a browser-based Capture The Flag (CTF) game where your Linux skills will be put to the test! \n
      Use common Linux commands to navigate through directories, search for clues, and unlock flags to progress through various levels.`
  };

  const getCurrentDirectory = (directories) => {
    let currentDir = fileSystem;
    for (let i = 1; i < directories.length; i++) {
        currentDir = currentDir[directories[i]];
        if (!currentDir) {
          return null;
        }
    }

    return currentDir;
  }

  const commandsConfig = {
    help: (params, directories) => 'Level 1: Welcome to CryptoHunt.',
    cat: (filename, directories) => {      
      let currentDir = getCurrentDirectory(directories);
      return (currentDir[filename] === undefined) ? 'No such file exists' : currentDir[filename];
    }
  };

  const handleSuccess = () => {
    //alert('Congratulations! You got the flag.');
    // Logic to proceed to the next level
  };

  const handleFailure = () => {
    console.log('Incorrect command');
  };

  return (
    <Terminal
      commandsConfig={commandsConfig}
      levelName="Level 1"
      onSuccess={handleSuccess}
      onFailure={handleFailure}
      fileSystem = {fileSystem}
    />
  );
};

export default LevelOne;
