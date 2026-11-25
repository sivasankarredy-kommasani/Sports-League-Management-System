// Visual seat map for the selected stand.
// Colour coding: Green = Available, Blue = Selected, Grey = Already Booked.
// Keeps selected seat count and booking quantity strictly synchronized (max 6).

function SeatSelector({
  stand,
  bookedSeats,
  selectedSeats,
  quantity,
  seatMessage,
  onToggleSeat,
  onQuantityChange,
}) {
  const totalSeats = stand.rows.length * stand.seatsPerRow;
  const availableCount = Math.max(0, totalSeats - bookedSeats.length);
  const maxSelectable = Math.min(6, availableCount);

  return (
    <div className="seat-selector-card">
      <div className="seat-selector-header">
        <div>
          <h3>{stand.name}</h3>
          <p className="card-meta">
            Tier: <strong>{stand.tier}</strong> • ₹{stand.price.toLocaleString("en-IN")} per seat
          </p>
        </div>
        <div className="seat-stats">
          <span className="badge badge-upcoming">{availableCount} Available</span>
          <span className="badge badge-format">{selectedSeats.length} Selected</span>
        </div>
      </div>

      <div className="quantity-bar">
        <label htmlFor="ticket-quantity">Ticket Quantity (1–6):</label>
        <select
          id="ticket-quantity"
          value={quantity}
          onChange={(e) => onQuantityChange(Number(e.target.value))}
          disabled={availableCount === 0}
        >
          {[0, 1, 2, 3, 4, 5, 6].map((num) => {
            if (num === 0 && selectedSeats.length > 0) return null;
            if (num > maxSelectable) return null;
            return (
              <option key={num} value={num}>
                {num === 0
                  ? "Select seats (0)"
                  : `${num} ${num === 1 ? "Seat" : "Seats"}`}
              </option>
            );
          })}
        </select>
      </div>

      {seatMessage && <p className="seat-notice">{seatMessage}</p>}

      <div className="seat-legend">
        <span className="legend-item">
          <span className="seat-sample seat-available" /> Available
        </span>
        <span className="legend-item">
          <span className="seat-sample seat-selected" /> Selected
        </span>
        <span className="legend-item">
          <span className="seat-sample seat-booked" /> Already Booked
        </span>
      </div>

      <div className="pitch-direction">▲ Facing Cricket Ground ▲</div>

      <div className="seat-grid-rows">
        {stand.rows.map((row) => (
          <div key={row} className="seat-row">
            <span className="seat-row-label">Row {row}</span>
            <div className="seat-row-buttons">
              {Array.from({ length: stand.seatsPerRow }, (_, index) => {
                const seatCode = `${row}${index + 1}`;
                const isBooked = bookedSeats.includes(seatCode);
                const isSelected = selectedSeats.includes(seatCode);

                return (
                  <button
                    key={seatCode}
                    type="button"
                    disabled={isBooked}
                    onClick={() => onToggleSeat(seatCode)}
                    className={`seat-btn ${
                      isBooked
                        ? "seat-booked"
                        : isSelected
                        ? "seat-selected"
                        : "seat-available"
                    }`}
                    title={
                      isBooked
                        ? `Seat ${seatCode} (Booked)`
                        : isSelected
                        ? `Seat ${seatCode} (Selected)`
                        : `Seat ${seatCode} (Available)`
                    }
                  >
                    {seatCode}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SeatSelector;
