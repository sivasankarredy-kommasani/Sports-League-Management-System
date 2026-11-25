// Reusable card component for displaying a single cricket news item.
function NewsCard({ item }) {
  return (
    <article className="card news-card">
      <div className="card-header">
        <span className="badge badge-format">{item.category}</span>
        <span className="news-date">{item.date}</span>
      </div>

      <h3 className="card-title">{item.title}</h3>
      <p className="news-summary">{item.summary}</p>
    </article>
  );
}

export default NewsCard;
