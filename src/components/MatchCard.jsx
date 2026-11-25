import { Link } from "react-router-dom";

function MatchCard({ match }) {
  const statusClass =
    match.status === "Upcoming"
      ? "badge-upcoming"
      : match.status === "Live"
      ? "badge-live"
      : "badge-finished";

  return (
    <article className="card match-card">
      <div className="card-header">
        <div className="badge-group">
          <span className="badge badge-format">{match.format}</span>
          <span className="badge badge-category">{match.category}</span>
          {match.isDemo && <span className="badge badge-demo">DEMO DATA</span>}
        </div>
        <span className={`badge ${statusClass}`}>{match.status}</span>
      </div>

      <p className="match-tournament">{match.tournament}</p>

      <div className="match-teams">
        <span className="team-pill">
          <span aria-hidden="true">{match.team1Flag}</span> {match.team1}
        </span>
        <span className="vs-label">vs</span>
        <span className="team-pill">
          <span aria-hidden="true">{match.team2Flag}</span> {match.team2}
        </span>
      </div>

      <div className="match-meta-list">
        <p className="card-meta">
          <strong>Date:</strong> {match.displayDate}
          {match.time && match.time !== "Schedule to be announced"
            ? ` • ${match.time}`
            : ""}
        </p>
        <p className="card-meta">
          <strong>Venue:</strong>{" "}
          {match.venue === "Schedule to be announced"
            ? "Schedule to be announced"
            : `${match.venue}, ${match.city}`}
        </p>
      </div>

      {match.status === "Results" && match.resultText && (
        <div className="match-result-box">
          {match.scorecard && match.scorecard.length > 0 && (
            <div className="mini-scores">
              {match.scorecard.map((row) => (
                <div key={row.team} className="mini-score-row">
                  <span>{row.team}</span>
                  <strong>
                    {row.runs}/{row.wickets} ({row.overs} ov)
                  </strong>
                </div>
              ))}
            </div>
          )}
          <p className="match-result">{match.resultText}</p>
        </div>
      )}

      {match.status === "Live" && match.liveNote && (
        <p className="match-live-note">{match.liveNote}</p>
      )}

      <div className="card-actions">
        <Link to={`/matches/${match.id}`} className="btn btn-outline">
          View Details
        </Link>
        {match.status === "Upcoming" && match.ticketEligible && (
          <Link to={`/tickets?match=${match.id}`} className="btn btn-primary">
            Book Tickets
          </Link>
        )}
      </div>
    </article>
  );
}

export default MatchCard;
