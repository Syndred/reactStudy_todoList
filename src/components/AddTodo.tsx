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
    <div className="flex w-full mb-6 space-x-3">
      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="添加新的待办事项..."
        className="flex-grow p-3 rounded-lg bg-gray-700 text-white border border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400 transition duration-300 ease-in-out"
      />
      <button
        onClick={handleAddTodo}
        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
      >
        添加
      </button>
    </div>
  );
};

export default AddTodo;
