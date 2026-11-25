import { Link } from "react-router-dom";
import LiveScoresSection from "../components/LiveScoresSection";
import MatchCard from "../components/MatchCard";
import PlayerCard from "../components/PlayerCard";
import { matches } from "../data/matches";
import { players } from "../data/players";

const TOURNAMENT_CATEGORY_CARDS = [
  {
    title: "Senior Men's Cricket",
    filterCategory: "Senior India",
    description: "Home & away Tests, ODIs, and T20Is featuring Team India.",
    badge: "Bilateral & ICC",
  },
  {
    title: "India A",
    filterCategory: "India A",
    description: "India A tours, unofficial Tests, and emerging one-day series.",
    badge: "Shadow Squad",
  },
  {
    title: "India Under-19",
    filterCategory: "India U19",
    description: "ICC Under-19 World Cup & youth bilateral showcases.",
    badge: "Future Stars",
  },
  {
    title: "Asian Cricket Tournaments",
    filterCategory: "Asian Tournaments",
    description: "ACC Asia Cup, U19 Asia Cup, and continental tournaments.",
    badge: "ACC Events",
  },
];

function Home() {
  const upcomingMatches = matches.filter(
    (match) => match.status === "Upcoming" && match.ticketEligible
  );
  const nextThreeMatches = upcomingMatches.slice(0, 3);

  const recentResults = matches
    .filter((match) => match.status === "Results" && match.category === "Senior India")
    .slice(0, 2);

  const starPlayers = players.filter((player) => player.star).slice(0, 4);

  return (
    <div className="page">
      {/* LIVE MATCHES & SCORES Section */}
      <LiveScoresSection />

      {/* A. Upcoming Matches */}
      <section className="section">
        <div className="section-header">
          <div>
            <h2>Upcoming Matches</h2>
            <p className="section-subtitle">Next 3 confirmed India home season fixtures</p>
          </div>
          <Link to="/matches" className="section-link">
            See all fixtures &rarr;
          </Link>
        </div>
        <div className="card-grid">
          {nextThreeMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      </section>

      {/* B. Recent Results (Demo Data) */}
      <section className="section">
        <div className="section-header">
          <div>
            <h2>Recent Results</h2>
            <p className="section-subtitle">
              Sample scorecards clearly marked as DEMO DATA
            </p>
          </div>
          <Link to="/matches" className="section-link">
            All scores &rarr;
          </Link>
        </div>
        <div className="card-grid card-grid-2">
          {recentResults.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      </section>

      {/* C. Star Players */}
      <section className="section">
        <div className="section-header">
          <div>
            <h2>Star Players</h2>
            <p className="section-subtitle">Featured Indian cricket icons</p>
          </div>
          <Link to="/players" className="btn btn-outline">
            View All Players
          </Link>
        </div>
        <div className="card-grid card-grid-4">
          {starPlayers.map((player) => (
            <PlayerCard key={player.id} player={player} />
          ))}
        </div>
      </section>

      {/* D. Tournament Categories */}
      <section className="section">
        <div className="section-header">
          <div>
            <h2>Tournament Categories</h2>
            <p className="section-subtitle">
              Explore matches across all Indian national &amp; Asian squads
            </p>
          </div>
        </div>
        <div className="card-grid card-grid-4">
          {TOURNAMENT_CATEGORY_CARDS.map((item) => (
            <Link
              key={item.title}
              to={`/matches?category=${encodeURIComponent(item.filterCategory)}`}
              className="card category-card"
            >
              <span className="badge badge-format">{item.badge}</span>
              <h3 className="card-title">{item.title}</h3>
              <p className="card-meta">{item.description}</p>
              <span className="category-cta">Explore fixtures &rarr;</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
