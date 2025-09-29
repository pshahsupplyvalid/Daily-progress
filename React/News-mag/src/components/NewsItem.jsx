const NewsItem = ({ title, description, src, url, darkMode = false }) => {
  return (
    <div
      className={`card ${darkMode ? "bg-dark text-light" : "bg-white text-dark"} shadow-sm`}
      style={{
        maxWidth: "345px",
        border: "1px solid",
        borderColor: darkMode ? "#444" : "#ddd",
        transition: "all 0.3s ease", // smooth transition for dark/light toggle
      }}
    >
      <img
        src={src || "https://via.placeholder.com/300x200?text=No+Image"}
        className="card-img-top"
        alt={title || "news image"}
        style={{ objectFit: "cover", height: "200px" }}
      />
      <div className="card-body">
        <h5 className="card-title">{title || "No Title"}</h5>
        <p className="card-text">
          {description ? description.slice(0, 100) + "..." : "No description available."}
        </p>
        <a
          href={url || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className={`btn ${darkMode ? "btn-light" : "btn-primary"}`}
        >
          Read More
        </a>
      </div>
    </div>
  );
};

export default NewsItem;
