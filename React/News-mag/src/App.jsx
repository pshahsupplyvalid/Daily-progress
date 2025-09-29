import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import NewsBoard from "./components/NewsBoard";

const App = () => {
  useEffect(() => {
    alert("This is the official website!");
  }, []); // empty dependency array → runs once when the component mounts

  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? "bg-dark text-light" : "bg-light text-dark"}>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <NewsBoard darkMode={darkMode} />
    </div>
  );
};

export default App;
