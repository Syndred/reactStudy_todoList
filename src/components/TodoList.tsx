import { Todo } from "@/types";
interface Props {
  todos: Todo[];
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
}
function TodoList({ todos, deleteTodo, toggleTodo }: Props) {
  const list = todos.map((item) => (
    <div key={item.id} className="w-64 bg-slate-500 my-4 flex justify-between :after:bg-red-500 divide-opacity-10">
      <p className={ item.completed ? "line-through" : "none" }>{item.text}</p>
      <div>
        <button onClick={() => toggleTodo(item.id)} className="mr-2">完成</button>
        <button onClick={() => deleteTodo(item.id)}>删除</button>
      </div>
    </div>
  ));
  return (
    <div>
      {list}
    </div>
  );
}

export default TodoList;
