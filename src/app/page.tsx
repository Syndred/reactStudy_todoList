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
    <div className="container mx-auto mt-56 w-1/3 min-h-56 p-6 flex items-center flex-col justify-evenly bg-gray-300">
      <h1>TodoList</h1>
      <AddTodo addTodo={addTodo} />
      <TodoList
        // todos={filter}
        todos={getFilteredTodos()}
        deleteTodo={deleteTodo}
        toggleTodo={toggleTodo}
      />
      <div>
        <TodoFilter setFilterStatus={setFilter} />
      </div>
    </div>
  );
}
