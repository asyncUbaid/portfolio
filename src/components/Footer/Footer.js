import { useState } from "react";
import ContactModal from "../ContactModal/ContactModal";
import "./Footer.css";

function Footer() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <footer className="footer">
        <div className="container footer-content">

          <div className="footer-left">
            <h3>Ubaid Ansari</h3>
            <p>Mobile App Developer</p>
          </div>

          <div className="footer-right">
            <button
              className="contact-btn"
              onClick={() => setOpen(true)}
            >
              Contact Me
            </button>
          </div>

        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} Ubaid Ansari. All Rights Reserved.
        </div>
      </footer>

      <ContactModal
        isOpen={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

export default Footer;