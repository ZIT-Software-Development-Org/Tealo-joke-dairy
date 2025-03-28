import React, { createContext, useContext, useState, ReactNode } from "react";

// Define Joke Type
interface Joke {
  id: number;
  joke: string;
  date: string;
}

// Context Type
interface JokesContextType {
  jokes: Joke[];
  addJoke: (newJoke: string) => void;
}

// Create Context
const JokesContext = createContext<JokesContextType | undefined>(undefined);

// Custom Hook for using context
export const useJokes = () => {
  const context = useContext(JokesContext);
  if (!context) {
    throw new Error("useJokes must be used within a JokesProvider");
  }
  return context;
};

// Provider Component
export const JokesProvider = ({ children }: { children: ReactNode }) => {
  const [jokes, setJokes] = useState<Joke[]>([
    { id: 1, joke: "Why did the scarecrow win an award? Because he was outstanding in his field!", date: "Mar 15, 2025" },
    { id: 2, joke: "Parallel lines have so much in common. It’s a shame they’ll never meet.", date: "Mar 14, 2025" },
    { id: 3, joke: "I told my wife she should embrace her mistakes. She gave me a hug.", date: "Mar 13, 2025" },
  ]);

  // Function to add a joke
  const addJoke = (newJoke: string) => {
    const trimmedJoke = newJoke.trim();
    if (trimmedJoke !== "") {
      setJokes([
        { id: Date.now(), joke: trimmedJoke, date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) },
        ...jokes
      ]);
    }
  };

  return (
    <JokesContext.Provider value={{ jokes, addJoke }}>
      {children}
    </JokesContext.Provider>
  );
};
