import { useState } from "react";
import "./Contact.css";
import AnimatedSection from "../AnimatedSection/AnimatedSection";

function Contact({ socials }) {
  const [copied, setCopied] = useState(false);
  
  const copyEmail = async (email) => {
    try {
      await navigator.clipboard.writeText(email);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  };

  const emailItem = socials.find(
    (item) =>
      item.Platform?.toLowerCase() === "email"
  );

  const socialLinks = socials.filter(
    (item) =>
      item.Platform?.toLowerCase() !== "email"
  );

  return (
    <AnimatedSection>

    <section
      id="contact"
      className="contact-section"
      >
      <div className="container">

        <h2 className="section-title">
          Let's Connect
        </h2>

        <p className="contact-description">
          Interested in working together,
          discussing opportunities,
          or simply saying hello?
        </p>

        {emailItem && (
          <div className="email-card">

            <div>
              <span className="email-label">
                Email
              </span>

              <p className="email-value">
                {emailItem.URL}
              </p>
            </div>

            <button
              className="copy-btn"
              onClick={() =>
                copyEmail(emailItem.URL)
              }
            >
              {copied
                ? "Copied!"
                : "Copy"}
            </button>

          </div>
        )}

        <div className="social-grid">

          {socialLinks.map(
              (social, index) => (
                  <a
                  key={index}
                  href={social.URL}
                  target="_blank"
                  rel="noreferrer"
                  className="social-card"
                  >
                {social.Platform}
              </a>
            )
        )}

        </div>

      </div>
    </section>
        </AnimatedSection>
  );
}

export default Contact;