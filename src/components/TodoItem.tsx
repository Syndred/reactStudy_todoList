import { Todo } from "@/types";
import React from "react";

interface TodoItemProps {
  todo: Todo;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
}

function TodoItem({ todo, toggleTodo, deleteTodo }: TodoItemProps) {
  const formattedDate = new Date(todo.createdAt).toLocaleString();

  return (
    <div className="flex items-center justify-between p-4 my-2 bg-gray-800 rounded-lg shadow-lg border border-blue-500 transform transition-transform duration-300 hover:scale-105">
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => toggleTodo(todo.id)}
          className="form-checkbox h-5 w-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 transition duration-150 ease-in-out"
        />
        <p className={`ml-4 text-lg font-medium ${todo.completed ? "line-through text-gray-500" : "text-white"}`}>
          {todo.text}
        </p>
      </div>
      <div className="flex flex-col items-end">
        <span className="text-sm text-gray-400 mb-1">{formattedDate}</span>
        <div className="flex space-x-2">
          <button
            onClick={() => toggleTodo(todo.id)}
            className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
          >
            {todo.completed ? "撤销" : "完成"}
          </button>
          <button
            onClick={() => deleteTodo(todo.id)}
            className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
          >
            删除
          </button>
        </div>
      </div>
    </div>
  );
}

export default TodoItem;
