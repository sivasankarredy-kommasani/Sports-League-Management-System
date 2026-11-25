import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import SeatSelector from "../components/SeatSelector";
import StadiumLayout from "../components/StadiumLayout";
import { useAuth } from "../context/AuthContext";
import { matches } from "../data/matches";
import { getStadiumById } from "../data/stadiums";

const BOOKINGS_KEY = "icm_bookings";
const SELECTED_SEATS_KEY = "icm_selected_seats";
const DEMO_AVAILABILITY_KEY = "icm_demo_seat_availability";

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function getAllSeatCodes(stand) {
  const codes = [];
  stand.rows.forEach((row) => {
    for (let i = 1; i <= stand.seatsPerRow; i += 1) {
      codes.push(`${row}${i}`);
    }
  });
  return codes;
}

function generateUniqueBookingId(existingBookings) {
  const existingIds = new Set(existingBookings.map((b) => b.id));
  let candidate = "";
  do {
    const timePart = Date.now().toString().slice(-4);
    const randPart = Math.floor(1000 + Math.random() * 9000);
    candidate = `ICM-${timePart}${randPart}`;
  } while (existingIds.has(candidate));
  return candidate;
}

function Tickets() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const bookableMatches = matches.filter(
    (match) => match.status === "Upcoming" && match.ticketEligible
  );

  const queryMatchId = searchParams.get("match");
  const initialMatch =
    bookableMatches.find((match) => match.id === queryMatchId) ||
    bookableMatches[0];

  const [selectedMatchId, setSelectedMatchId] = useState(
    initialMatch ? initialMatch.id : ""
  );

  const selectedMatch = bookableMatches.find(
    (match) => match.id === selectedMatchId
  );
  const stadium = getStadiumById(selectedMatch?.stadiumId);

  const [selectedStandId, setSelectedStandId] = useState(stadium.stands[0].id);
  const [bookings, setBookings] = useState(() => readStorage(BOOKINGS_KEY, []));
  const [seatDrafts, setSeatDrafts] = useState(() =>
    readStorage(SELECTED_SEATS_KEY, {})
  );
  const [seatMessage, setSeatMessage] = useState("");
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const activeStand =
    stadium.stands.find((stand) => stand.id === selectedStandId) ||
    stadium.stands[0];

  // Build map of booked seats per stand for the selected match
  // Combines static demo booked seats + active (non-cancelled) bookings from localStorage.
  const bookedSeatsByStand = {};
  stadium.stands.forEach((stand) => {
    const userBookedForStand = bookings
      .filter(
        (b) =>
          b.matchId === selectedMatchId &&
          b.standId === stand.id &&
          b.status !== "Cancelled"
      )
      .flatMap((b) => b.selectedSeats || []);

    bookedSeatsByStand[stand.id] = Array.from(
      new Set([...stand.baseBooked, ...userBookedForStand])
    );
  });

  // Persist demo seat availability snapshot in localStorage whenever bookings or match change.
  useEffect(() => {
    if (!selectedMatchId) return;
    const availabilitySnapshot = readStorage(DEMO_AVAILABILITY_KEY, {});
    const standSummary = {};
    stadium.stands.forEach((stand) => {
      const total = stand.rows.length * stand.seatsPerRow;
      const booked = bookedSeatsByStand[stand.id] || [];
      standSummary[stand.id] = {
        totalSeats: total,
        bookedSeats: booked,
        availableCount: Math.max(0, total - booked.length),
      };
    });
    availabilitySnapshot[selectedMatchId] = standSummary;
    localStorage.setItem(
      DEMO_AVAILABILITY_KEY,
      JSON.stringify(availabilitySnapshot)
    );
  }, [selectedMatchId, bookings]);

  // Persist in-progress selected seats in localStorage.
  useEffect(() => {
    localStorage.setItem(SELECTED_SEATS_KEY, JSON.stringify(seatDrafts));
  }, [seatDrafts]);

  const draftKey = `${selectedMatchId}__${activeStand.id}`;
  const currentBookedSeats = bookedSeatsByStand[activeStand.id] || [];
  const allStandSeats = getAllSeatCodes(activeStand);
  const availableSeats = allStandSeats.filter(
    (code) => !currentBookedSeats.includes(code)
  );

  // Filter any saved draft seats in case they became booked since last visit.
  const rawDraftSeats = seatDrafts[draftKey];
  const selectedSeats = Array.isArray(rawDraftSeats)
    ? rawDraftSeats.filter((code) => availableSeats.includes(code))
    : availableSeats.slice(0, 1);

  const quantity = selectedSeats.length;
  const totalPrice = activeStand.price * quantity;

  function updateSelectedSeats(nextSeats) {
    setSeatDrafts((prev) => ({
      ...prev,
      [draftKey]: nextSeats,
    }));
    setSeatMessage("");
    setConfirmedBooking(null);
  }

  function handleMatchChange(newMatchId) {
    setSelectedMatchId(newMatchId);
    setSearchParams({ match: newMatchId });
    setSelectedStandId(getStadiumById(
      bookableMatches.find((m) => m.id === newMatchId)?.stadiumId
    ).stands[0].id);
    setSeatMessage("");
    setConfirmedBooking(null);
  }

  function handleStandSelect(standId) {
    setSelectedStandId(standId);
    setSeatMessage("");
    setConfirmedBooking(null);
  }

  function handleToggleSeat(seatCode) {
    if (currentBookedSeats.includes(seatCode)) return;

    if (selectedSeats.includes(seatCode)) {
      const next = selectedSeats.filter((code) => code !== seatCode);
      updateSelectedSeats(next);
      return;
    }

    if (selectedSeats.length >= 6) {
      setSeatMessage("Maximum 6 seats can be selected per booking.");
      return;
    }

    updateSelectedSeats([...selectedSeats, seatCode]);
  }

  function handleQuantityChange(newQty) {
    const clamped = Math.max(0, Math.min(6, newQty));
    if (clamped === 0) {
      updateSelectedSeats([]);
      return;
    }

    if (clamped <= selectedSeats.length) {
      updateSelectedSeats(selectedSeats.slice(0, clamped));
      return;
    }

    const needed = clamped - selectedSeats.length;
    const additional = availableSeats
      .filter((code) => !selectedSeats.includes(code))
      .slice(0, needed);
    updateSelectedSeats([...selectedSeats, ...additional]);
  }

  function handleConfirmBooking(event) {
    event.preventDefault();

    if (!selectedMatch || selectedSeats.length === 0) {
      setSeatMessage("Please select at least 1 available seat before confirming.");
      return;
    }

    const latestBookings = readStorage(BOOKINGS_KEY, []);
    const bookingId = generateUniqueBookingId(latestBookings);

    const newBooking = {
      id: bookingId,
      matchId: selectedMatch.id,
      matchTitle: selectedMatch.title,
      tournament: selectedMatch.tournament,
      format: selectedMatch.format,
      matchDate: selectedMatch.displayDate,
      matchTime: selectedMatch.time,
      stadiumName: stadium.name,
      city: stadium.city,
      standId: activeStand.id,
      standName: activeStand.name,
      standTier: activeStand.tier,
      pricePerTicket: activeStand.price,
      selectedSeats: [...selectedSeats],
      quantity: selectedSeats.length,
      totalPrice,
      status: "Confirmed",
      bookedBy: user.name,
      bookedAt: new Date().toLocaleString("en-IN"),
    };

    const updatedBookings = [newBooking, ...latestBookings];
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(updatedBookings));
    setBookings(updatedBookings);

    // Clear draft seats for this match/stand after confirmation
    setSeatDrafts((prev) => {
      const copy = { ...prev };
      delete copy[draftKey];
      return copy;
    });

    setConfirmedBooking(newBooking);
    setSeatMessage("");
  }

  function handlePrintTicket() {
    window.print();
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Interactive Stadium Ticket Booking</h1>
        <p>
          Select an upcoming India match, click a stand in the stadium map, and
          pick your seats.
        </p>
      </div>

      {/* Match Selector */}
      <div className="detail-card match-picker-card">
        <div className="form-group">
          <label htmlFor="match-select">Select Upcoming Match</label>
          <select
            id="match-select"
            value={selectedMatchId}
            onChange={(e) => handleMatchChange(e.target.value)}
          >
            {bookableMatches.map((match) => (
              <option key={match.id} value={match.id}>
                {match.title} — {match.displayDate} ({match.venue}, {match.city})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Interactive Stadium + Seat Grid + Booking Summary */}
      <div className="tickets-workspace">
        <div className="tickets-left-col">
          <StadiumLayout
            stadium={stadium}
            selectedStandId={activeStand.id}
            onSelectStand={handleStandSelect}
            bookedSeatsByStand={bookedSeatsByStand}
          />

          <SeatSelector
            stand={activeStand}
            bookedSeats={currentBookedSeats}
            selectedSeats={selectedSeats}
            quantity={quantity}
            seatMessage={seatMessage}
            onToggleSeat={handleToggleSeat}
            onQuantityChange={handleQuantityChange}
          />
        </div>

        <aside className="tickets-right-col">
          {confirmedBooking ? (
            <div className="detail-card booking-success printable-ticket">
              <span className="badge badge-upcoming">Booking Confirmed</span>
              <h2>E-Ticket Receipt (Demo)</h2>
              <p className="booking-id">
                Booking ID: <strong>{confirmedBooking.id}</strong>
              </p>

              <div className="summary-rows">
                <div>
                  <span>Match</span>
                  <strong>{confirmedBooking.matchTitle}</strong>
                </div>
                <div>
                  <span>Date &amp; Time</span>
                  <strong>
                    {confirmedBooking.matchDate} • {confirmedBooking.matchTime}
                  </strong>
                </div>
                <div>
                  <span>Stadium</span>
                  <strong>
                    {confirmedBooking.stadiumName}, {confirmedBooking.city}
                  </strong>
                </div>
                <div>
                  <span>Stand</span>
                  <strong>
                    {confirmedBooking.standName} ({confirmedBooking.standTier})
                  </strong>
                </div>
                <div>
                  <span>Selected Seats</span>
                  <strong>{confirmedBooking.selectedSeats.join(", ")}</strong>
                </div>
                <div>
                  <span>Tickets</span>
                  <strong>{confirmedBooking.quantity}</strong>
                </div>
                <div className="total-row">
                  <span>Total Amount</span>
                  <strong>
                    ₹{confirmedBooking.totalPrice.toLocaleString("en-IN")}
                  </strong>
                </div>
              </div>

              <p className="demo-payment-note">
                Frontend Educational Demo — No actual payment is processed.
              </p>

              <div className="confirmation-actions no-print">
                <button
                  type="button"
                  className="btn btn-primary btn-full"
                  onClick={handlePrintTicket}
                >
                  Download / Print Ticket
                </button>
                <Link to="/my-bookings" className="btn btn-outline btn-full">
                  View My Bookings
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleConfirmBooking} className="detail-card summary-card">
              <h2>Booking Summary</h2>
              <p className="detail-series">{selectedMatch?.tournament}</p>

              <div className="summary-rows">
                <div>
                  <span>Match</span>
                  <strong>{selectedMatch?.title}</strong>
                </div>
                <div>
                  <span>Date</span>
                  <strong>{selectedMatch?.displayDate}</strong>
                </div>
                <div>
                  <span>Stadium</span>
                  <strong>
                    {stadium.name}, {stadium.city}
                  </strong>
                </div>
                <div>
                  <span>Selected Stand</span>
                  <strong>
                    {activeStand.name} ({activeStand.tier})
                  </strong>
                </div>
                <div>
                  <span>Selected Seats</span>
                  <strong>
                    {selectedSeats.length > 0
                      ? selectedSeats.join(", ")
                      : "None selected"}
                  </strong>
                </div>
                <div>
                  <span>Number of Tickets</span>
                  <strong>{quantity}</strong>
                </div>
                <div>
                  <span>Price per Seat</span>
                  <strong>₹{activeStand.price.toLocaleString("en-IN")}</strong>
                </div>
                <div className="total-row">
                  <span>Total Price</span>
                  <strong>₹{totalPrice.toLocaleString("en-IN")}</strong>
                </div>
              </div>

              <p className="demo-payment-note">
                Frontend Educational Demo — No actual payment is processed.
              </p>

              <button
                type="submit"
                className="btn btn-primary btn-full"
                disabled={selectedSeats.length === 0}
              >
                Confirm Booking
              </button>
            </form>
          )}
        </aside>
      </div>
    </div>
  );
}

export default Tickets;
