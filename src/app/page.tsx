"use client";
import AddTodo from "@/components/AddTodo";
import TodoFilter from "@/components/TodoFilter";
import TodoList from "@/components/TodoList";
import { useState, useEffect } from "react";
import { Todo } from "@/types";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  // const [filter, setFilter] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<string>("all");

  const addTodo = (text: string) => {
    const newTodo = {
      id: Date.now(),
      text,
      completed: false,
      createdAt: Date.now(), // 添加创建时间
    };
    setTodos([...todos, newTodo]);
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)),
    );
  };

  // 过滤逻辑
  // useEffect(() => {
  //   let filteredTodos: Todo[] = [];
  //   switch (filterStatus) {
  //     case "all":
  //       filteredTodos = todos;
  //       break;
  //     case "completed":
  //       filteredTodos = todos.filter((todo) => todo.completed);
  //       break;
  //     case "uncompleted":
  //       filteredTodos = todos.filter((todo) => !todo.completed);
  //       break;
  //     default:
  //       filteredTodos = todos;
  //   }
  //   setFilter(filteredTodos);
  // }, [todos, filterStatus]);
const getFilteredTodos=() => {
  switch (filter) {
    case "all":
      return todos;
    case "completed":
      return todos.filter((todo) => todo.completed);
    case "uncompleted":
      return todos.filter((todo) => !todo.completed);
    default:
      return todos;
  }
}
  return (
    <div className="container mx-auto mt-20 max-w-md p-6 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl shadow-lg min-h-screen">
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-8 select-none">
        TodoList
      </h1>
      <AddTodo addTodo={addTodo} />
      <div className="w-full my-6">
        <TodoFilter setFilterStatus={setFilter} />
      </div>
      <TodoList
        todos={getFilteredTodos()}
        deleteTodo={deleteTodo}
        toggleTodo={toggleTodo}
      />
    </div>
  );
}
