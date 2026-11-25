import { Link, useParams } from "react-router-dom";
import { matches } from "../data/matches";

function getDaysRemaining(dateString) {
  if (!dateString) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const matchDate = new Date(dateString + "T00:00:00");
  const diffMs = matchDate - today;
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

function MatchDetails() {
  const { id } = useParams();
  const match = matches.find((item) => item.id === id);

  if (!match) {
    return (
      <div className="page">
        <div className="empty-state">
          <h2>Match Not Found</h2>
          <p>The requested match could not be found.</p>
          <Link to="/matches" className="btn btn-primary">
            Back to Matches
          </Link>
        </div>
      </div>
    );
  }

  const daysRemaining =
    match.status === "Upcoming" ? getDaysRemaining(match.date) : null;

  const statusClass =
    match.status === "Upcoming"
      ? "badge-upcoming"
      : match.status === "Live"
      ? "badge-live"
      : "badge-finished";

  return (
    <div className="page">
      <Link to="/matches" className="back-link">
        &larr; Back to Matches
      </Link>

      <div className="detail-card">
        <div className="card-header">
          <div className="badge-group">
            <span className="badge badge-format">{match.format}</span>
            <span className="badge badge-category">{match.category}</span>
            {match.isDemo && <span className="badge badge-demo">DEMO DATA</span>}
          </div>
          <span className={`badge ${statusClass}`}>{match.status}</span>
        </div>

        <h1>{match.title}</h1>
        <p className="detail-series">
          {match.tournament} • {match.tournamentCategory}
        </p>

        <div className="match-teams match-teams-lg">
          <span className="team-pill">
            <span aria-hidden="true">{match.team1Flag}</span> {match.team1}
          </span>
          <span className="vs-label">vs</span>
          <span className="team-pill">
            <span aria-hidden="true">{match.team2Flag}</span> {match.team2}
          </span>
        </div>

        <div className="detail-grid">
          <div className="detail-item">
            <span className="detail-label">Match Date &amp; Time</span>
            <span className="detail-value">
              {match.displayDate}
              {match.time && match.time !== "Schedule to be announced"
                ? ` (${match.time})`
                : ""}
            </span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Stadium &amp; City</span>
            <span className="detail-value">
              {match.venue === "Schedule to be announced"
                ? "Schedule to be announced"
                : `${match.venue}, ${match.city}`}
            </span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Match Status</span>
            <span className="detail-value">{match.status}</span>
          </div>

          {match.status === "Upcoming" && (
            <div className="detail-item">
              <span className="detail-label">Countdown</span>
              <span className="detail-value highlight-text">
                {daysRemaining === null
                  ? "Schedule to be announced"
                  : daysRemaining > 0
                  ? `${daysRemaining} days remaining`
                  : daysRemaining === 0
                  ? "Match Day!"
                  : "Scheduled"}
              </span>
            </div>
          )}
        </div>

        {match.status === "Upcoming" && (
          <div className="detail-actions">
            {match.ticketEligible ? (
              <Link to={`/tickets?match=${match.id}`} className="btn btn-primary">
                Book Tickets
              </Link>
            ) : (
              <p className="info-banner">
                Tickets are not yet open for this fixture (schedule/venue to be confirmed).
              </p>
            )}
          </div>
        )}

        {match.status === "Live" && (
          <div className="scorecard-section">
            <h2>Live Match Status</h2>
            <div className="info-banner">
              {match.liveNote ||
                "Demo live fixture — live ball-by-ball scorecard is unavailable in frontend-only mode."}
            </div>
          </div>
        )}

        {match.status === "Results" && (
          <div className="scorecard-section">
            <h2>Scorecard</h2>
            <p className="match-result">{match.resultText}</p>
            {match.scorecard && match.scorecard.length > 0 ? (
              <div className="table-wrapper">
                <table className="scorecard-table">
                  <thead>
                    <tr>
                      <th>Team Name</th>
                      <th>Runs</th>
                      <th>Wickets</th>
                      <th>Overs</th>
                      <th>Top Performer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {match.scorecard.map((row) => (
                      <tr key={row.team}>
                        <td>
                          <strong>{row.team}</strong>
                        </td>
                        <td>{row.runs}</td>
                        <td>{row.wickets}</td>
                        <td>{row.overs}</td>
                        <td>{row.topPerformer}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="info-banner">
                Official scorecard is not available for this demo match.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MatchDetails;
