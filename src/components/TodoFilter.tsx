function TodoFilter({ setFilterStatus }: any) {
  return (
    <div className="w-64 flex justify-between">
      <button onClick={() => setFilterStatus("all")}>全部</button>
      <button onClick={() => setFilterStatus("completed")}>已完成</button>
      <button onClick={() => setFilterStatus("uncompleted")}>未完成</button>
    </div>
  );
}

export default TodoFilter;
