import { useState } from "react";
import PlayerCard from "../components/PlayerCard";
import { PLAYER_FILTERS, players } from "../data/players";

const ROLE_OPTIONS = [
  "All Roles",
  "Batsman",
  "Bowler",
  "All-rounder",
  "Wicketkeeper",
];

function Players() {
  const [activeFilter, setActiveFilter] = useState("All Players");
  const [roleDropdown, setRoleDropdown] = useState("All Roles");
  const [searchTerm, setSearchTerm] = useState("");

  function matchesCategoryOrRoleTab(player) {
    switch (activeFilter) {
      case "Batsmen":
        return player.role === "Batsman";
      case "Bowlers":
        return player.role === "Bowler";
      case "All-rounders":
        return player.role === "All-rounder";
      case "Wicketkeepers":
        return player.role === "Wicketkeeper";
      case "India A":
        return player.teamCategory === "India A";
      case "Under-19":
        return player.teamCategory === "Under-19";
      default:
        return true;
    }
  }

  const query = searchTerm.trim().toLowerCase();

  const filteredPlayers = players.filter((player) => {
    const matchesTab = matchesCategoryOrRoleTab(player);
    const matchesDropdown =
      roleDropdown === "All Roles" || player.role === roleDropdown;
    const matchesName =
      !query ||
      player.name.toLowerCase().includes(query) ||
      player.homeState.toLowerCase().includes(query);

    return matchesTab && matchesDropdown && matchesName;
  });

  function resetFilters() {
    setActiveFilter("All Players");
    setRoleDropdown("All Roles");
    setSearchTerm("");
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Indian Cricket Squad Directory</h1>
        <p>
          Explore Senior India, India A, and sample Under-19 player profiles with
          search and role filters.
        </p>
      </div>

      {/* Category & Role Filter Tabs */}
      <div className="tabs category-tabs">
        {PLAYER_FILTERS.map((filterName) => (
          <button
            key={filterName}
            type="button"
            className={`tab-btn ${activeFilter === filterName ? "active" : ""}`}
            onClick={() => setActiveFilter(filterName)}
          >
            {filterName}
          </button>
        ))}
      </div>

      {/* Search by Name & Role Dropdown */}
      <div className="controls-bar">
        <div className="search-group">
          <input
            type="text"
            placeholder="Search player by name or state..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search player by name"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="player-role-select">Role:</label>
          <select
            id="player-role-select"
            value={roleDropdown}
            onChange={(e) => setRoleDropdown(e.target.value)}
          >
            {ROLE_OPTIONS.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="results-count">
        Showing <strong>{filteredPlayers.length}</strong>{" "}
        {filteredPlayers.length === 1 ? "player" : "players"}
      </p>

      {filteredPlayers.length === 0 ? (
        <div className="empty-state">
          <h3>No Players Found</h3>
          <p>No players match your current search and filter selection.</p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={resetFilters}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="card-grid card-grid-4">
          {filteredPlayers.map((player) => (
            <PlayerCard key={player.id} player={player} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Players;
