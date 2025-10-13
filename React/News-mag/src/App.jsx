
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import NewsBoard from "./components/NewsBoard";
import Footer from "./components/Footer";


const App = () => {
  const [darkMode, setDarkMode] = useState(() => {
    // Load saved mode from localStorage or default to false
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    alert("This is the official website!");
  }, []);

  // Save dark mode preference whenever it changes
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <div className={darkMode ? "bg-dark text-light" : "bg-light text-dark"}>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <NewsBoard darkMode={darkMode} />
      <Footer />  
    </div>
  );
};

export default App;
