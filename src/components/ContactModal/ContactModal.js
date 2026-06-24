import { useState } from "react";
import emailjs from "@emailjs/browser";
import "./ContactModal.css";

function ContactModal({ isOpen, onClose }) {
const SERVICE_ID =
  process.env.REACT_APP_EMAILJS_SERVICE_ID;

const TEMPLATE_ID =
  process.env.REACT_APP_EMAILJS_TEMPLATE_ID;

const PUBLIC_KEY =
  process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

const SCRIPT_URL =
  process.env.REACT_APP_GOOGLE_SHEET_SCRIPT_URL;
    
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Save enquiry in Google Sheet

      await fetch(SCRIPT_URL, {
  method: "POST",
  mode: "no-cors",
  body: JSON.stringify({
    name: formData.name,
    email: formData.email,
    message: formData.message,
  }),
});

      // Send email

      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
        },
        PUBLIC_KEY
      );

      setSuccess(true);

      setFormData({
        name: "",
        email: "",
        message: "",
      });

      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 3000);

    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="modal-overlay">
        <div className="modal">

          <h2>Contact Me</h2>

          <form onSubmit={handleSubmit}>

            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <textarea
              name="message"
              placeholder="Your Message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              required
            />

            <div className="modal-actions">

              <button
                type="button"
                onClick={onClose}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "Sending..."
                  : "Send Message"}
              </button>

            </div>

          </form>

        </div>
      </div>

      {success && (
        <div className="success-overlay">

          <div className="success-modal">

            <div className="success-icon">
              ✓
            </div>

            <h2>Thank You!</h2>

            <p>
              Your message has been sent successfully.
              <br />
              I'll get back to you shortly.
            </p>

          </div>

        </div>
      )}
    </>
  );
}

export default ContactModal;