import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import "./Navbar.css";

  const sections = [
    "home",
    "about",
    "skills",
    "experience",
    "contact",
  ];
function Navbar({ onOpenResumeEditor }) {
  const [activeSection, setActiveSection] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
useEffect(() => {
  const handleScroll = () => {
    const scrollY = window.scrollY;

    // Top of page
    if (scrollY < 100) {
      setActiveSection("home");
      return;
    }

    const scrollPosition = scrollY + 200;

    sections.forEach((section) => {
      const element = document.getElementById(section);

      if (
        element &&
        scrollPosition >= element.offsetTop &&
        scrollPosition < element.offsetTop + element.offsetHeight
      ) {
        setActiveSection(section);
      }
    });
  };

  window.addEventListener("scroll", handleScroll);

  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
}, []);

const handleNavClick = (section) => {
  console.log(section);
  console.log(document.getElementById(section));

  setMenuOpen(false);

  document
    .getElementById(section)
    ?.scrollIntoView({
      behavior: "smooth",
    });
};

const openPasswordModal = () => {
  setPassword("");
  setPasswordError("");
  setPasswordOpen(true);
  setMenuOpen(false);
};

const submitPassword = (event) => {
  event.preventDefault();

  if (password === "219410") {
    setPasswordOpen(false);
    setPassword("");
    setPasswordError("");
    onOpenResumeEditor?.();
  } else {
    setPasswordError("Incorrect master password.");
  }
};

  return (
    <nav className="navbar">

      <div className="container navbar-container">

        <div className="logo">
          UA
        </div>

        <ul
          className={`nav-links ${
            menuOpen ? "open" : ""
          }`}
        >
          {sections.map((section) => (
            <li key={section}>
              <button
                className={
                  activeSection === section
                    ? "active"
                    : ""
                }
                onClick={() =>
                  handleNavClick(section)
                }
              >
                {section.charAt(0).toUpperCase() +
                  section.slice(1)}
              </button>
            </li>
          ))}
          <li>
            <button
              type="button"
              className="nav-star"
              onClick={openPasswordModal}
              aria-label="Open resume editor"
              title="Resume editor"
            >
              <FaStar />
            </button>
          </li>
        </ul>

        <button
          className="hamburger"
          onClick={() =>
            setMenuOpen(!menuOpen)
          }
        >
          ☰
        </button>

      </div>

      {passwordOpen && (
        <div
          className="password-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setPasswordOpen(false);
            }
          }}
        >
          <form className="password-modal" onSubmit={submitPassword}>
            <button
              type="button"
              className="password-modal-close"
              onClick={() => setPasswordOpen(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h2>Resume Editor Access</h2>
            <p>Enter the master password to continue.</p>
            <input
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setPasswordError("");
              }}
              placeholder="Master password"
              autoFocus
              required
            />
            {passwordError && (
              <p className="password-error" role="alert">
                {passwordError}
              </p>
            )}
            <button type="submit" className="password-submit">
              Enter
            </button>
          </form>
        </div>
      )}

    </nav>
  );
}

export default Navbar;