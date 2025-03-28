import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiBook, FiSmile, FiPlusCircle, FiLogOut, FiMenu } from "react-icons/fi";
import { useJokes } from "../JokesContext"; // Import context

const Dashboard = () => {
  const { jokes, addJoke } = useJokes(); // Get jokes and addJoke function from context
  const [newJoke, setNewJoke] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleAddJoke = () => {
    addJoke(newJoke); // Call the function from context
    setNewJoke("");   // Clear input
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 fixed md:static w-64 bg-yellow-300 p-6 h-full transition-transform duration-300 ease-in-out`}>
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <FiBook className="mr-2" /> Joke Diary
        </h2>
        <nav>
          <ul className="space-y-4">
            <li>
              <Link to="/dashboard/all-jokes" className="flex items-center space-x-3 hover:text-blue-600">
                <FiSmile className="text-lg" />
                <span>All Jokes</span>
              </Link>
            </li>
            <li>
              <button className="flex items-center space-x-3 text-red-500 hover:text-red-600">
                <FiLogOut className="text-lg" />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Add Joke Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Add a New Joke</h3>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <input
              type="text"
              className="flex-1 px-4 py-2 border rounded-lg"
              placeholder="Type your joke here..."
              value={newJoke}
              onChange={(e) => setNewJoke(e.target.value)}
            />
            <button className="bg-yellow-400 hover:bg-yellow-500 text-white py-2 px-4 rounded-lg flex items-center" onClick={handleAddJoke}>
              <FiPlusCircle className="mr-2" /> Add Joke
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
