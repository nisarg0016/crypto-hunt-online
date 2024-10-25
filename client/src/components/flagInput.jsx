import React, { useState, useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import axios from "axios"

const FlagInput = ({ flag, level }) => {
  const { userDetails } = useContext(AuthContext);
  const [userInput, setUserInput] = useState("");

  const handleSubmit = async (e) => {
    if (userInput.trim() === flag) {
      //alert("Correct flag!");
      // make the request here
      try {
        const response = await axios.post(
          'http://localhost:8000/api/levels/update-level',
          { 
            userId: userDetails._id, 
            level: level
          }, // Sending userId and level in the request body
          {
              headers: {
                  'Content-Type': 'application/json', // Sets the content type to JSON
              },
          }
      );
        if (response.data.success) {
          window.location.reload();
        }
      } catch (error) {
        throw error;
      }
    } else {
      alert("Incorrect flag!");
    }
  };

  return (
    <div className="flag-input-container">
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
