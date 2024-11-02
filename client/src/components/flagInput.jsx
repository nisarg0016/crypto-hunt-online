import React, { useState, useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import axios from "axios";

const FlagInput = ({ flag, level }) => {
  const { userDetails } = useContext(AuthContext);
  const [userInput, setUserInput] = useState("");

  const handleSubmit = async (e) => {
    if (userInput.trim() === flag) {
      // Alert or any success action
      try {console.log("Level to update:", level);

        const response = await axios.post(
          'http://localhost:8000/api/levels/update-level',
          { 
            userId: userDetails._id, 
            level: level
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        // Optionally, handle the response (e.g., show a success message)
      } catch (error) {
        console.error("Error updating level:", error);
      }
    } else {
      alert("Incorrect flag!");
    }
  };

  const handleClick = (e) => {
    e.stopPropagation(); // Prevent focus from going back to the terminal
  };

  return (
    <div className="flag-input-container" onClick={handleClick}>
      <form onSubmit={handleSubmit}>
        <label>Enter Flag: </label>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default FlagInput;
