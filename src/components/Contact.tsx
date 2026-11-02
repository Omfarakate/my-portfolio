import { useState } from "react";
import { MdArrowOutward, MdCopyright } from "react-icons/md";
import "./styles/Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFallbackMailto = () => {
    const mailtoUrl = `mailto:omfarkate7515@gmail.com?subject=${encodeURIComponent(
      `Portfolio Inquiry from ${formData.name || "Visitor"}`
    )}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    )}`;
    window.location.href = mailtoUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setStatusMessage("");

    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

    if (!accessKey) {
      handleFallbackMailto();
      setStatus("success");
      setStatusMessage("Opening your email client to send the message...");
      return;
    }

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: formData.name,
          email: formData.email,
          message: formData.message,
          from_name: `${formData.name} (Portfolio)`,
          subject: `New Portfolio Message from ${formData.name}`,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setStatus("success");
        setStatusMessage("Thank you! Your message has been sent successfully.");
        setFormData({ name: "", email: "", message: "" });
      } else {
        throw new Error(data.message || "Submission failed");
      }
    } catch {
      setStatus("error");
      setStatusMessage("Couldn't send automatically. Click here to send via your email client.");
    }
  };

  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h3>Contact</h3>

        <div className="contact-form-container">
          <div className="contact-form-header">
            <h4>Send a Message</h4>
            <p>
              Have a project, role, or collaboration in mind? Drop your message
              below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="contact-form-row">
              <div className="contact-input-group">
                <label htmlFor="contact-name">Name</label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  required
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  data-cursor="disable"
                />
              </div>
              <div className="contact-input-group">
                <label htmlFor="contact-email">Email</label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  required
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  data-cursor="disable"
                />
              </div>
            </div>

            <div className="contact-input-group">
              <label htmlFor="contact-message">Message</label>
              <textarea
                id="contact-message"
                name="message"
                rows={4}
                required
                placeholder="Write your message here..."
                value={formData.message}
                onChange={handleChange}
                data-cursor="disable"
              />
            </div>

            <button
              type="submit"
              className="contact-submit-btn"
              disabled={status === "submitting"}
              data-cursor="disable"
            >
              {status === "submitting" ? "Sending..." : "Send Message"}
              <MdArrowOutward />
            </button>

            {statusMessage && (
              <div
                className={`contact-status-msg ${status}`}
                onClick={status === "error" ? handleFallbackMailto : undefined}
                style={{ cursor: status === "error" ? "pointer" : "default" }}
              >
                {statusMessage}
              </div>
            )}
          </form>
        </div>

        <div className="contact-flex">
          <div className="contact-box">
            <h4>Email</h4>
            <p>
              <a href="mailto:omfarkate7515@gmail.com" data-cursor="disable">
                omfarkate7515@gmail.com
              </a>
            </p>
            <h4>Phone</h4>
            <p>
              <a href="tel:+919156461153" data-cursor="disable">
                (+91) 9156461153
              </a>
            </p>
          </div>
          <div className="contact-box">
            <h4>Social</h4>
            <a
              href="https://github.com/Omfarakate"
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              Github <MdArrowOutward />
            </a>
            <a
              href="https://linkedin.com/in/omfarakate"
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              Linkedin <MdArrowOutward />
            </a>
            <a
              href="https://leetcode.com/u/omsfarakate/"
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              LeetCode <MdArrowOutward />
            </a>
          </div>
          <div className="contact-box">
            <h2>
              Designed and Developed <br /> by <span>Om Farakate</span>
            </h2>
            <h5>
              <MdCopyright /> 2026
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
