import { useState } from "react";
import { Link } from "react-router-dom";

function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function PlayerCard({ player }) {
  const [imageError, setImageError] = useState(false);
  const showFallback = !player.image || imageError;

  return (
    <article className="card player-card">
      <div className="player-photo-frame">
        {showFallback ? (
          <div className="player-photo-fallback" aria-label={player.name}>
            <span>{getInitials(player.name)}</span>
          </div>
        ) : (
          <img
            src={player.image}
            alt={player.name}
            className="player-photo"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        )}
        <span className="player-category-pill">{player.teamCategory}</span>
      </div>

      <div className="player-card-body">
        <div className="player-card-top">
          <h3 className="card-title">{player.name}</h3>
          {player.isSampleProfile && (
            <span className="badge badge-demo">Sample Profile</span>
          )}
        </div>
        <p className="player-role-label">{player.role}</p>
        <p className="card-meta">State: {player.homeState}</p>

        <div className="card-actions">
          <Link to={`/players/${player.id}`} className="btn btn-outline btn-full">
            View Profile
          </Link>
        </div>
      </div>
    </article>
  );
}

export default PlayerCard;
