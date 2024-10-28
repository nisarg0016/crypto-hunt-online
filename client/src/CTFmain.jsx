import Terminal from "./components/terminal";
import FlagInput from "./components/flagInput";
import { useState, useContext } from "react";
import { AuthContext } from "./Context/AuthContext";

const CTFMainPage = () => {
    const { userDetails } = useContext(AuthContext)
    const [allFlags, setAllFlags] = useState(userDetails.flags); /// should ideally retrieve from the backend
    const [levelComplete, setLevelComplete] = useState(userDetails.levelFinished); // there will be a fixed number of levels anyway

    const handleFlagSuccess = (levelIndex) => {
      const updatedLevels = [...levelComplete];
      updatedLevels[levelIndex] = true; 
      setLevelComplete(updatedLevels);
    };
    
    return (
    <div className="App">
      <Terminal/>
    </div>
    );
};

export default CTFMainPage;

