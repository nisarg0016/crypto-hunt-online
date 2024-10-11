import Terminal from "./components/terminal";
import LevelOne from "./components/level1/level1";
import LevelTwo from "./components/level2/level2";
import { useState } from "react";
import FlagInput from "./components/flagInput";

function App() {
  const [allFlags, setAllFlags] = useState(["abc", "def"]); /// should ideally retrieve from the backend
  const [levelComplete, setLevelComplete] = useState([false, false]); // there will be a fixed number of levels anyway

  const handleFlagSuccess = (levelIndex) => {
    const updatedLevels = [...levelComplete];
    updatedLevels[levelIndex] = true; 
    setLevelComplete(updatedLevels);
  };

  return (
    <div className="App">
      {!levelComplete[0] && 
      <>
        <LevelOne flag = {allFlags[0]}/> 
        <FlagInput flag={allFlags[0]} onSuccess={() => handleFlagSuccess(0)}/>
      </>
      }
      {levelComplete[0] && !levelComplete[1] && 
        <>
          <LevelTwo flag = {allFlags[1]}/>
          <FlagInput flag={allFlags[0]} onSuccess={() => handleFlagSuccess(0)}/>
        </>
      }
    </div>
  );
}

export default App;
