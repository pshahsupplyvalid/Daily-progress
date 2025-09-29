import { useEffect, useState } from "react";
import NewsItem from "./NewsItem";

const NewsBoard = ({ darkMode }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiKey = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    if (!apiKey) {
      setError("API key is missing. Check your .env file.");
      setLoading(false);
      return;
    }

    const url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") {
          setArticles(data.articles || []);
        } else {
          setError(data.message || "Failed to fetch news");
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [apiKey]);

  if (loading) return <p className="text-center mt-3">Loading news...</p>;
  if (error) return <p className="text-center mt-3 text-danger">Error: {error}</p>;

  return (
    <div
      className={darkMode ? "bg-dark text-light" : "bg-light text-dark"}
      style={{ minHeight: "100vh", padding: "20px" }}
    >
      {/* Centered Heading */}
      <h2 className="text-center mb-4">
        <span style={{ color: "red", fontWeight: "bold" }}>Latest</span> News
      </h2>

      {/* News Cards */}
      <div className="d-flex flex-wrap gap-3 justify-content-center">
        {articles.length > 0 ? (
          articles.map((news, index) => (
            <NewsItem
              key={index}
              title={news.title}
              description={news.description}
              src={news.urlToImage || "https://via.placeholder.com/300x200?text=No+Image"}
              url={news.url}
              darkMode={darkMode} 
            />
          ))
        ) : (
          <p className="text-center w-100">No news available.</p>
        )}
      </div>
    </div>
  );
};

export default NewsBoard;
