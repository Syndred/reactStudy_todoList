"use client";
import AddTodo from "@/components/AddTodo";
import TodoFilter from "@/components/TodoFilter";
import TodoList from "@/components/TodoList";
import { useState } from "react";
import { Todo } from "@/types";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  let [filter, setFilter] = useState<Todo[]>([]);

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

  const filterTodo = (status: string) => {
    filter = todos;
    switch (status) {
      case "all":
        filter = [];
        break;
      case "completed":
        filter = todos.filter((todo) => todo.completed);
        break;
      case "uncompleted":
        filter = todos.filter((todo) => !todo.completed);
        break;
      default:
        filter = todos;
    }
    setFilter(filter);
  };

  return (
    <div>
      <h1>TodoList</h1>
      <AddTodo addTodo={addTodo} />
      <TodoList
        todos={filter[0] ? filter : todos}
        deleteTodo={deleteTodo}
        toggleTodo={toggleTodo}
      />
      <TodoFilter filterTodo={filterTodo} />
    </div>
  );
}
