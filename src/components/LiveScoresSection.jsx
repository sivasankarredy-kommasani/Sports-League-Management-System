import { Link } from "react-router-dom";
import { matches } from "../data/matches";

// Reusable LIVE MATCHES & SCORES scoreboard section used on Home and Matches pages.
// Displays a single featured live match when available, or "No Live Matches Right Now"
// along with the next upcoming ticket-eligible India match.
function LiveScoresSection() {
  const featuredLiveMatch = matches.find((match) => match.status === "Live");
  const nextUpcomingMatch = matches.find(
    (match) => match.status === "Upcoming" && match.ticketEligible
  );

  return (
    <section className="live-scores-banner" aria-label="Live Matches and Scores">
      <div className="live-banner-top">
        <div className="live-heading-group">
          <span className="live-indicator">
            <span className="live-dot" aria-hidden="true" />
            LIVE
          </span>
          <div>
            <h1 className="live-heading">LIVE MATCHES</h1>
            <p className="live-subheading">
              LIVE MATCHES &amp; SCORES • Sample scores clearly labeled as DEMO
            </p>
          </div>
        </div>
      </div>

      {!featuredLiveMatch ? (
        <div className="no-live-card">
          <p className="no-live-title">No Live Matches Right Now</p>
          {nextUpcomingMatch && (
            <div className="next-upcoming-spotlight">
              <div className="next-upcoming-info">
                <span className="badge badge-upcoming">Next Upcoming Match</span>
                <h2>
                  <span aria-hidden="true">{nextUpcomingMatch.team1Flag}</span>{" "}
                  {nextUpcomingMatch.team1} vs{" "}
                  <span aria-hidden="true">{nextUpcomingMatch.team2Flag}</span>{" "}
                  {nextUpcomingMatch.team2}
                </h2>
                <p>
                  {nextUpcomingMatch.tournament} • {nextUpcomingMatch.format}
                </p>
                <p>
                  <strong>Date:</strong> {nextUpcomingMatch.displayDate} •{" "}
                  <strong>Venue:</strong> {nextUpcomingMatch.venue},{" "}
                  {nextUpcomingMatch.city}
                </p>
              </div>
              <Link
                to={`/tickets?match=${nextUpcomingMatch.id}`}
                className="btn btn-primary live-book-btn"
              >
                BOOK TICKETS
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="live-scoreboard-grid">
          <article className="live-scoreboard-card">
            <div className="live-card-meta-row">
              <div className="badge-group">
                <span className="live-pill">
                  <span className="live-dot" aria-hidden="true" />
                  LIVE
                </span>
                <span className="badge badge-format">
                  {featuredLiveMatch.format}
                </span>
                {featuredLiveMatch.isDemo && (
                  <span className="badge badge-demo">DEMO</span>
                )}
              </div>
              <span className="live-tournament">
                {featuredLiveMatch.tournament}
              </span>
            </div>

            <div className="live-teams-row">
              <div className="live-team">
                <span className="live-flag" aria-hidden="true">
                  {featuredLiveMatch.team1Flag}
                </span>
                <div>
                  <span className="live-team-name">
                    {featuredLiveMatch.team1}
                  </span>
                  <span className="live-team-code">
                    {featuredLiveMatch.team1Code}
                  </span>
                </div>
              </div>

              <span className="live-vs">VS</span>

              <div className="live-team live-team-right">
                <div>
                  <span className="live-team-name">
                    {featuredLiveMatch.team2}
                  </span>
                  <span className="live-team-code">
                    {featuredLiveMatch.team2Code}
                  </span>
                </div>
                <span className="live-flag" aria-hidden="true">
                  {featuredLiveMatch.team2Flag}
                </span>
              </div>
            </div>

            <div className="live-score-box">
              {featuredLiveMatch.liveScore ? (
                <>
                  <div className="live-score-main">
                    <span className="live-batting-label">
                      {featuredLiveMatch.battingTeam || featuredLiveMatch.team1}
                    </span>
                    <strong className="live-score-value">
                      {featuredLiveMatch.liveScore.runs}/
                      {featuredLiveMatch.liveScore.wickets}
                    </strong>
                    <span className="live-overs-value">
                      ({featuredLiveMatch.liveScore.overs} Overs)
                    </span>
                  </div>
                  <p className="live-innings-text">
                    <strong>Innings:</strong>{" "}
                    {featuredLiveMatch.currentInnings || "In Progress"}
                  </p>
                </>
              ) : (
                <p className="live-score-unavailable">
                  Live score unavailable
                </p>
              )}
            </div>

            <div className="live-card-footer">
              <p className="live-status-text">
                <strong>Status:</strong>{" "}
                {featuredLiveMatch.liveStatus ||
                  featuredLiveMatch.liveNote ||
                  "Live"}
              </p>
              <p className="live-venue-text">
                <strong>Venue:</strong>{" "}
                {featuredLiveMatch.venue === "Schedule to be announced"
                  ? featuredLiveMatch.venue
                  : `${featuredLiveMatch.venue}, ${featuredLiveMatch.city}`}
              </p>
            </div>

            <div className="live-card-actions">
              <Link
                to={`/matches/${featuredLiveMatch.id}`}
                className="btn btn-light"
              >
                View Details
              </Link>
            </div>
          </article>
        </div>
      )}
    </section>
  );
}

export default LiveScoresSection;
