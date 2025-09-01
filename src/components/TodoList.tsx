import { Todo } from "@/types";
import TodoItem from "./TodoItem"; // 导入 TodoItem 组件

interface Props {
  todos: Array<Todo>;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
}

function TodoList({ todos, deleteTodo, toggleTodo }: Props) {
  return (
    <div className="w-full max-h-96 overflow-y-auto custom-scrollbar">
      {todos.length === 0 ? (
        <p className="text-gray-400 text-center py-4">暂无待办事项，快来添加吧！</p>
      ) : (
        todos.map((item) => (
          <TodoItem
            key={item.id}
            todo={item}
            toggleTodo={toggleTodo}
            deleteTodo={deleteTodo}
          />
        ))
      )}
    </div>
  );
}

export default TodoList;
