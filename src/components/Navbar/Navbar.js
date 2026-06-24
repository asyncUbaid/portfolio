import { useEffect, useState } from "react";
import "./Navbar.css";

function Navbar() {
  const [activeSection, setActiveSection] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  const sections = [
    "home",
    "about",
    "skills",
    "experience",
    "contact",
  ];
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

    </nav>
  );
}

export default Navbar;