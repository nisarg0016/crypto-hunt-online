import React from 'react';
import Terminal from '../terminal';

const LevelOne = () => {
  // Define the commands for Level 1
  const fileSystem = {
      'flag.txt': 'The flag is {FLAG}',
      'README': `Welcome to CryptoHunt:
      CryptoHunt is a browser-based Capture The Flag (CTF) game where your Linux skills will be put to the test! \n
      Use common Linux commands to navigate through directories, search for clues, and unlock flags to progress through various levels.`
  };

  const commandsConfig = {
    help: (params) => 'Level 1: Welcome to CryptoHunt.',
    cat: (params) => {
      // pass the directories stack into this
      if (params === 'flag.txt') {
          return fileSystem['flag.txt'];
      } else if (params === 'README') {
          return fileSystem['README'];
      } else {
          return 'No such file exists!';
      }
    }
  };

  const handleSuccess = () => {
    //alert('Congratulations! You got the flag.');
    // Logic to proceed to the next level
  };

  /// We can add a filesystem for each level, incase they need it
  /*
  const fileSystem = {
    home: {
      player: {
        documents: {
          'level_info.txt': 'This is level 1',
          'flag.txt': 'FLAG{level_1_flag}',
        },
      },
    },
    bin: {},
    etc: {
      'config.txt': '',
    },
  };
  */

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
