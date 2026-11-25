// Interactive top-down SVG Cricket Stadium component.
// Displays the ground, pitch, boundary, pavilion, scoreboard, main entrance,
// and clickable stands coloured by tier (General, Premium, VIP).

function StadiumLayout({ stadium, selectedStandId, onSelectStand, bookedSeatsByStand }) {
  const standsByPos = {};
  stadium.stands.forEach((stand) => {
    standsByPos[stand.position] = stand;
  });

  function getAvailableCount(stand) {
    const total = stand.rows.length * stand.seatsPerRow;
    const booked = (bookedSeatsByStand[stand.id] || []).length;
    return Math.max(0, total - booked);
  }

  function renderStandProps(position) {
    const stand = standsByPos[position];
    const isSelected = stand && stand.id === selectedStandId;
    const tierClass =
      stand?.tier === "VIP"
        ? "stadium-stand--vip"
        : stand?.tier === "Premium"
        ? "stadium-stand--premium"
        : "stadium-stand--general";

    return {
      stand,
      className: `stadium-stand ${tierClass} ${isSelected ? "is-selected" : ""}`,
      onClick: () => stand && onSelectStand(stand.id),
      role: "button",
      tabIndex: 0,
      onKeyDown: (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          stand && onSelectStand(stand.id);
        }
      },
      "aria-label": stand
        ? `${stand.name} (${stand.tier} ₹${stand.price}) - ${getAvailableCount(
            stand
          )} seats available`
        : position,
    };
  }

  return (
    <div className="stadium-card">
      <div className="stadium-header">
        <div>
          <h2>{stadium.name}</h2>
          <p className="stadium-subtitle">
            {stadium.city} • {stadium.capacity}
          </p>
        </div>
        <span className="badge badge-demo">Demo Seating Map</span>
      </div>

      <p className="stadium-note">
        Click any stand on the stadium map below to inspect availability and pick seats.
        Note: This is a demo seating layout, not an official stadium seating map.
      </p>

      <div className="stadium-legend">
        <span className="legend-item">
          <span className="legend-dot legend-general" /> General (₹500)
        </span>
        <span className="legend-item">
          <span className="legend-dot legend-premium" /> Premium (₹1,500)
        </span>
        <span className="legend-item">
          <span className="legend-dot legend-vip" /> VIP (₹3,500)
        </span>
        <span className="legend-item">
          <span className="legend-dot legend-active" /> Selected Stand
        </span>
      </div>

      <div className="stadium-svg-wrap">
        <svg
          viewBox="0 0 680 500"
          className="stadium-svg"
          role="img"
          aria-label={`Interactive demo seating layout for ${stadium.name}`}
        >
          {/* Outer Stadium Shell */}
          <rect
            x="16"
            y="16"
            width="648"
            height="468"
            rx="180"
            className="stadium-outer-wall"
          />

          {/* Scoreboard */}
          <rect x="468" y="34" width="132" height="32" rx="6" className="stadium-facility" />
          <text x="534" y="54" textAnchor="middle" className="stadium-facility-text">
            SCOREBOARD
          </text>

          {/* Main Entrance */}
          <rect x="78" y="432" width="142" height="32" rx="6" className="stadium-facility" />
          <text x="149" y="452" textAnchor="middle" className="stadium-facility-text">
            MAIN ENTRANCE
          </text>

          {/* Pavilion */}
          <rect x="78" y="34" width="124" height="32" rx="6" className="stadium-facility" />
          <text x="140" y="54" textAnchor="middle" className="stadium-facility-text">
            PAVILION
          </text>

          {/* North Stand (Top) */}
          <g {...renderStandProps("north")}>
            <rect x="215" y="32" width="240" height="58" rx="14" />
            <text x="335" y="57" textAnchor="middle" className="stand-svg-title">
              NORTH STAND
            </text>
            <text x="335" y="75" textAnchor="middle" className="stand-svg-sub">
              General • ₹500 ({getAvailableCount(standsByPos.north)} free)
            </text>
          </g>

          {/* VIP Lounge (Top-Inner Executive Wing) */}
          <g {...renderStandProps("vip")}>
            <rect x="235" y="98" width="200" height="44" rx="12" />
            <text x="335" y="118" textAnchor="middle" className="stand-svg-title">
              VIP LOUNGE
            </text>
            <text x="335" y="134" textAnchor="middle" className="stand-svg-sub">
              VIP • ₹3,500 ({getAvailableCount(standsByPos.vip)} free)
            </text>
          </g>

          {/* West Stand (Left) */}
          <g {...renderStandProps("west")}>
            <rect x="40" y="145" width="96" height="205" rx="16" />
            <text x="88" y="242" textAnchor="middle" className="stand-svg-title">
              WEST
            </text>
            <text x="88" y="259" textAnchor="middle" className="stand-svg-title">
              STAND
            </text>
            <text x="88" y="278" textAnchor="middle" className="stand-svg-sub">
              ₹500 ({getAvailableCount(standsByPos.west)})
            </text>
          </g>

          {/* East Stand (Right) */}
          <g {...renderStandProps("east")}>
            <rect x="544" y="145" width="96" height="205" rx="16" />
            <text x="592" y="242" textAnchor="middle" className="stand-svg-title">
              EAST
            </text>
            <text x="592" y="259" textAnchor="middle" className="stand-svg-title">
              STAND
            </text>
            <text x="592" y="278" textAnchor="middle" className="stand-svg-sub">
              ₹500 ({getAvailableCount(standsByPos.east)})
            </text>
          </g>

          {/* Premium Gallery (Lower-Inner Wing) */}
          <g {...renderStandProps("premium")}>
            <rect x="225" y="356" width="230" height="46" rx="12" />
            <text x="340" y="376" textAnchor="middle" className="stand-svg-title">
              PREMIUM GALLERY
            </text>
            <text x="340" y="393" textAnchor="middle" className="stand-svg-sub">
              Premium • ₹1,500 ({getAvailableCount(standsByPos.premium)} free)
            </text>
          </g>

          {/* South Stand (Bottom) */}
          <g {...renderStandProps("south")}>
            <rect x="230" y="410" width="220" height="58" rx="14" />
            <text x="340" y="435" textAnchor="middle" className="stand-svg-title">
              SOUTH STAND
            </text>
            <text x="340" y="453" textAnchor="middle" className="stand-svg-sub">
              General • ₹500 ({getAvailableCount(standsByPos.south)} free)
            </text>
          </g>

          {/* Cricket Ground */}
          <ellipse cx="340" cy="250" rx="185" ry="96" className="stadium-outfield" />
          {/* Boundary Rope */}
          <ellipse cx="340" cy="250" rx="173" ry="88" className="stadium-boundary" />
          {/* 30-yard Inner Circle */}
          <ellipse cx="340" cy="250" rx="95" ry="50" className="stadium-inner-ring" />

          {/* Cricket Pitch */}
          <rect x="304" y="236" width="72" height="28" rx="3" className="stadium-pitch" />
          <line x1="314" y1="236" x2="314" y2="264" className="pitch-crease" />
          <line x1="366" y1="236" x2="366" y2="264" className="pitch-crease" />
        </svg>
      </div>

      {/* Quick clickable stand chips for easy tapping on small mobile screens */}
      <div className="stand-quick-pills">
        {stadium.stands.map((stand) => (
          <button
            key={stand.id}
            type="button"
            className={`stand-chip ${
              stand.id === selectedStandId ? "active" : ""
            }`}
            onClick={() => onSelectStand(stand.id)}
          >
            <span>{stand.name}</span>
            <strong>₹{stand.price}</strong>
          </button>
        ))}
      </div>
    </div>
  );
}

export default StadiumLayout;
