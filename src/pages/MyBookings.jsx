import { useState } from "react";
import { Link } from "react-router-dom";

const BOOKINGS_KEY = "icm_bookings";
const CANCELLED_KEY = "icm_cancelled_bookings";
const DEMO_AVAILABILITY_KEY = "icm_demo_seat_availability";

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function MyBookings() {
  const [bookings, setBookings] = useState(() => readStorage(BOOKINGS_KEY, []));

  function handleCancelBooking(bookingToCancel) {
    // 1. Update booking status to Cancelled and persist in localStorage
    const updatedBookings = bookings.map((booking) =>
      booking.id === bookingToCancel.id
        ? {
            ...booking,
            status: "Cancelled",
            cancelledAt: new Date().toLocaleString("en-IN"),
          }
        : booking
    );

    setBookings(updatedBookings);
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(updatedBookings));

    // 2. Track cancelled booking records explicitly in localStorage
    const cancelledList = readStorage(CANCELLED_KEY, []);
    if (!cancelledList.some((item) => item.id === bookingToCancel.id)) {
      localStorage.setItem(
        CANCELLED_KEY,
        JSON.stringify([
          { ...bookingToCancel, status: "Cancelled" },
          ...cancelledList,
        ])
      );
    }

    // 3. Free the cancelled seats in the stored demo seat availability snapshot
    const availability = readStorage(DEMO_AVAILABILITY_KEY, {});
    const matchSnap = availability[bookingToCancel.matchId];
    if (matchSnap && matchSnap[bookingToCancel.standId]) {
      const standSnap = matchSnap[bookingToCancel.standId];
      const freedSet = new Set(bookingToCancel.selectedSeats || []);
      const nextBooked = (standSnap.bookedSeats || []).filter(
        (seat) => !freedSet.has(seat)
      );
      standSnap.bookedSeats = nextBooked;
      standSnap.availableCount = Math.max(
        0,
        (standSnap.totalSeats || 0) - nextBooked.length
      );
      localStorage.setItem(DEMO_AVAILABILITY_KEY, JSON.stringify(availability));
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>My Bookings</h1>
          <p>
            View your confirmed and cancelled match tickets stored in localStorage.
          </p>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="empty-state">
          <h3>No Ticket Bookings Yet</h3>
          <p>
            Choose an upcoming India match and select your seats from the
            interactive stadium map.
          </p>
          <Link to="/tickets" className="btn btn-primary">
            Book Tickets
          </Link>
        </div>
      ) : (
        <div className="card-grid card-grid-2">
          {bookings.map((booking) => {
            const isCancelled = booking.status === "Cancelled";
            return (
              <article
                key={booking.id}
                className={`card booking-card ${isCancelled ? "is-cancelled" : ""}`}
              >
                <div className="card-header">
                  <span className="booking-code">{booking.id}</span>
                  <span
                    className={`badge ${
                      isCancelled ? "badge-cancelled" : "badge-upcoming"
                    }`}
                  >
                    {booking.status || "Confirmed"}
                  </span>
                </div>

                <h3 className="card-title">{booking.matchTitle}</h3>
                <p className="card-meta">
                  <strong>Date:</strong> {booking.matchDate}
                  {booking.matchTime ? ` • ${booking.matchTime}` : ""}
                </p>
                <p className="card-meta">
                  <strong>Stadium:</strong> {booking.stadiumName || booking.venue}
                  {booking.city ? `, ${booking.city}` : ""}
                </p>
                <p className="card-meta">
                  <strong>Stand:</strong> {booking.standName || booking.stand} (
                  {booking.standTier || "Standard"})
                </p>
                <p className="card-meta">
                  <strong>Selected Seats:</strong>{" "}
                  {booking.selectedSeats && booking.selectedSeats.length > 0
                    ? booking.selectedSeats.join(", ")
                    : "Standard Admission"}
                </p>

                <div className="booking-meta">
                  <span>
                    Tickets: <strong>{booking.quantity}</strong>
                  </span>
                  <span>
                    Total:{" "}
                    <strong>₹{booking.totalPrice.toLocaleString("en-IN")}</strong>
                  </span>
                </div>

                <div className="card-actions">
                  {isCancelled ? (
                    <span className="cancelled-note">
                      Seats released back to stadium availability
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => handleCancelBooking(booking)}
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyBookings;
