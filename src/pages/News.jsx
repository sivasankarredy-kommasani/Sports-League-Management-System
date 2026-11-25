import { useState } from "react";
import NewsCard from "../components/NewsCard";
import { NEWS_CATEGORIES, newsItems } from "../data/news";
import "../news.css";

// News page displaying cricket news cards with a category filter.
function News() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Filter news items based on the selected category tab.
  const filteredNews = newsItems.filter((item) => {
    if (selectedCategory === "All") {
      return true;
    }
    return item.category === selectedCategory;
  });

  return (
    <div className="page">
      <div className="page-header">
        <h1>Cricket News &amp; Updates</h1>
        <p>Latest season highlights, squad notes, and stadium ticket updates.</p>
        <div className="news-demo-badge">
          <span className="badge badge-demo">Sample / Demo News</span>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="tabs news-filter-tabs" role="tablist" aria-label="News categories">
        {NEWS_CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            role="tab"
            aria-selected={selectedCategory === category}
            className={`tab-btn ${selectedCategory === category ? "active" : ""}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <p className="results-count">
        Showing <strong>{filteredNews.length}</strong>{" "}
        {filteredNews.length === 1 ? "article" : "articles"}
      </p>

      {filteredNews.length === 0 ? (
        <div className="empty-state">
          <p>No news articles found in this category.</p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setSelectedCategory("All")}
          >
            Show All News
          </button>
        </div>
      ) : (
        <div className="card-grid">
          {filteredNews.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

export default News;
