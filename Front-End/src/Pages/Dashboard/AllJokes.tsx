import React from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { useJokes } from "../JokesContext"; // Import context

const AllJokes = () => {
  const { jokes } = useJokes(); // Get jokes from context

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center bg-white p-4 shadow-md rounded-lg">
        <h1 className="text-xl font-bold text-gray-800">All Jokes</h1>
        <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 flex items-center">
          <FiArrowLeft className="mr-2" /> Back to Dashboard
        </Link>
      </div>

      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">List of All Jokes</h3>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-yellow-200">
              <th className="p-3">Joke</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {jokes.map((joke) => (
              <tr key={joke.id} className="border-t">
                <td className="p-3">{joke.joke}</td>
                <td className="p-3">{joke.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllJokes;
