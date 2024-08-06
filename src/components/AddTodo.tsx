import React, { useState } from "react";

interface AddProps {
  addTodo: (text: string) => void;
}

const AddTodo = ({ addTodo }: AddProps) => {
  const [inputText, setInputText] = useState("");

  const handleAddTodo = () => {
    if (inputText.trim()) {
      addTodo(inputText);
      setInputText("");
    }
  };

  return (
    <div>
      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      <button onClick={handleAddTodo}>添加新代办</button>
    </div>
  );
};

export default AddTodo;
