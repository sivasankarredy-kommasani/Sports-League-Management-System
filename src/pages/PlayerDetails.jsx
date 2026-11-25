import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { players } from "../data/players";

function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function PlayerDetails() {
  const { id } = useParams();
  const player = players.find((item) => item.id === id);
  const [imageError, setImageError] = useState(false);

  if (!player) {
    return (
      <div className="page">
        <div className="empty-state">
          <h2>Player Not Found</h2>
          <p>We could not find that player profile.</p>
          <Link to="/players" className="btn btn-primary">
            Back to Players
          </Link>
        </div>
      </div>
    );
  }

  const showFallback = !player.image || imageError;

  return (
    <div className="page">
      <Link to="/players" className="back-link">
        &larr; Back to Players
      </Link>

      <div className="detail-card player-profile-card">
        <div className="player-profile-layout">
          <div className="player-profile-photo-wrap">
            {showFallback ? (
              <div className="player-photo-fallback player-photo-fallback-lg">
                <span>{getInitials(player.name)}</span>
              </div>
            ) : (
              <img
                src={player.image}
                alt={player.name}
                className="player-profile-photo"
                onError={() => setImageError(true)}
              />
            )}
          </div>

          <div className="player-profile-info">
            <div className="badge-group">
              <span className="badge badge-format">{player.role}</span>
              <span className="badge badge-category">{player.teamCategory}</span>
              {player.isSampleProfile && (
                <span className="badge badge-demo">Sample Profile</span>
              )}
            </div>

            <h1>{player.name}</h1>
            <p className="player-bio">{player.bio}</p>

            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Role</span>
                <span className="detail-value">{player.role}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Batting Style</span>
                <span className="detail-value">{player.battingStyle}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Bowling Style</span>
                <span className="detail-value">{player.bowlingStyle}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Home State</span>
                <span className="detail-value">{player.homeState}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Team Category</span>
                <span className="detail-value">{player.teamCategory}</span>
              </div>
            </div>

            <div className="detail-actions">
              <Link to="/players" className="btn btn-outline">
                Back to Players
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayerDetails;
