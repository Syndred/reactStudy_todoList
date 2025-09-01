interface FilterProps {
  setFilterStatus: (filter: string) => void;
}

function TodoFilter({ setFilterStatus }: FilterProps) {
  const buttonClass = "px-4 py-2 rounded-lg font-semibold transition duration-300 ease-in-out";
  const activeClass = "bg-blue-600 text-white shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50";
  const inactiveClass = "bg-gray-700 text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50";

  return (
    <div className="w-full flex justify-center space-x-4">
      <button
        onClick={() => setFilterStatus("all")}
        className={`${buttonClass} ${activeClass}`}
      >
        全部
      </button>
      <button
        onClick={() => setFilterStatus("completed")}
        className={`${buttonClass} ${inactiveClass}`}
      >
        已完成
      </button>
      <button
        onClick={() => setFilterStatus("uncompleted")}
        className={`${buttonClass} ${inactiveClass}`}
      >
        未完成
      </button>
    </div>
  );
}

export default TodoFilter;
