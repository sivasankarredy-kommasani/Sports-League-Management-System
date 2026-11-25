import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import LiveScoresSection from "../components/LiveScoresSection";
import MatchCard from "../components/MatchCard";
import { MATCH_CATEGORIES, matches } from "../data/matches";

const FORMAT_OPTIONS = ["All", "Test", "ODI", "T20I"];
const STATUS_OPTIONS = ["All", "Upcoming", "Live", "Results"];

function Matches() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category");
  const validInitialCategory = MATCH_CATEGORIES.includes(initialCategory)
    ? initialCategory
    : "All Matches";

  const [categoryTab, setCategoryTab] = useState(validInitialCategory);
  const [formatFilter, setFormatFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const paramCategory = searchParams.get("category");
    if (paramCategory && MATCH_CATEGORIES.includes(paramCategory)) {
      setCategoryTab(paramCategory);
    }
  }, [searchParams]);

  function handleCategoryChange(category) {
    setCategoryTab(category);
    if (category === "All Matches") {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
  }

  function resetAllFilters() {
    setCategoryTab("All Matches");
    setFormatFilter("All");
    setStatusFilter("All");
    setSearchTerm("");
    setSearchParams({});
  }

  const query = searchTerm.trim().toLowerCase();

  const filteredMatches = matches.filter((match) => {
    const matchesCategory =
      categoryTab === "All Matches" || match.category === categoryTab;
    const matchesFormat =
      formatFilter === "All" || match.format === formatFilter;
    const matchesStatus =
      statusFilter === "All" || match.status === statusFilter;
    const matchesSearch =
      !query ||
      match.team1.toLowerCase().includes(query) ||
      match.team2.toLowerCase().includes(query) ||
      match.venue.toLowerCase().includes(query) ||
      match.city.toLowerCase().includes(query) ||
      match.tournament.toLowerCase().includes(query) ||
      match.tournamentCategory.toLowerCase().includes(query);

    return matchesCategory && matchesFormat && matchesStatus && matchesSearch;
  });

  return (
    <div className="page">
      {/* LIVE MATCHES & SCORES Section at top of Matches page */}
      <LiveScoresSection />

      <div className="page-header">
        <h2>All India Cricket Matches</h2>
        <p>
          Browse Senior India, India A, India U19, and Asian tournament fixtures.
          Sample fixtures and unannounced schedules are clearly labeled.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="tabs category-tabs" role="tablist" aria-label="Match categories">
        {MATCH_CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            role="tab"
            aria-selected={categoryTab === category}
            className={`tab-btn ${categoryTab === category ? "active" : ""}`}
            onClick={() => handleCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Search, Format & Status Filters */}
      <div className="controls-bar">
        <div className="search-group">
          <input
            type="text"
            placeholder="Search team, venue, city, or tournament..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search matches"
          />
        </div>

        <div className="filters-cluster">
          <div className="filter-group">
            <label htmlFor="format-filter">Format:</label>
            <select
              id="format-filter"
              value={formatFilter}
              onChange={(e) => setFormatFilter(e.target.value)}
            >
              {FORMAT_OPTIONS.map((fmt) => (
                <option key={fmt} value={fmt}>
                  {fmt === "All" ? "All Formats" : fmt}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="status-filter">Status:</label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status === "All" ? "All Statuses" : status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <p className="results-count">
        Showing <strong>{filteredMatches.length}</strong>{" "}
        {filteredMatches.length === 1 ? "match" : "matches"}
      </p>

      {filteredMatches.length === 0 ? (
        <div className="empty-state">
          <h3>No Matches Found</h3>
          <p>Try clearing your search or switching format/status filters.</p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={resetAllFilters}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="card-grid">
          {filteredMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Matches;
