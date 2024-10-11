import React, { useState } from "react";

const FlagInput = ({ flag, onSuccess }) => {
  const [userInput, setUserInput] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userInput.trim() === flag) {
      setMessage("Flag correct!");
      onSuccess(); // Notify parent of success
    } else {
      setMessage("Incorrect flag. Try again.");
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
      {message && <p>{message}</p>}
    </div>
  );
};

export default FlagInput;
