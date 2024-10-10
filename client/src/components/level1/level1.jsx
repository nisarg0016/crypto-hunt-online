import React from 'react';
import Terminal from '../terminal';

const LevelOne = () => {
  // Define the commands for Level 1
  const commandsConfig = {
    help: () => 'Available commands: help, clear, flag',
    flag: () => 'FLAG{level_1_complete}', // Simulated flag
  };

  const handleSuccess = () => {
    alert('Congratulations! You got the flag.');
    // Logic to proceed to the next level
  };

  /// We can add a filesystem for each level, incase they need it
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
