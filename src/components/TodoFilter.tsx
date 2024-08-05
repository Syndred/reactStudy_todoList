function TodoFilter({ filterTodo }: any) {
  return (
    <div className="w-64 flex justify-between">
      <button onClick={() => filterTodo("all")}>全部</button>
      <button onClick={() => filterTodo("completed")}>已完成</button>
      <button onClick={() => filterTodo("uncompleted")}>未完成</button>
    </div>
  );
}

export default TodoFilter;
