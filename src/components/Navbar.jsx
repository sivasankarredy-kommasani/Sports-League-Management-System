import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // Hide navbar on the login page when no user is signed in.
  if (!user) {
    return null;
  }

  function handleLogout() {
    logout();
    setMenuOpen(false);
    navigate("/login");
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <span className="brand-badge">🇮🇳</span>
          <span>INDIA CRICKET MANAGER</span>
        </Link>

        <button
          type="button"
          className="navbar-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-label="Toggle navigation menu"
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>

        <nav className={`navbar-links ${menuOpen ? "open" : ""}`}>
          <NavLink to="/" end onClick={closeMenu}>
            Home
          </NavLink>
          <NavLink to="/matches" onClick={closeMenu}>
            Matches
          </NavLink>
          <NavLink to="/players" onClick={closeMenu}>
            Players
          </NavLink>
          <NavLink to="/tickets" onClick={closeMenu}>
            Book Tickets
          </NavLink>
          <NavLink to="/my-bookings" onClick={closeMenu}>
            My Bookings
          </NavLink>
          <NavLink to="/news" onClick={closeMenu}>
            News
          </NavLink>

          <div className="navbar-user">
            <span className="user-greeting">{user.name}</span>
            <button type="button" className="btn btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
