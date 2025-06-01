// src/components/common/Footer.jsx
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-column">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="</>">Home</a></li>
            <li><a href="/find-donors">Find Blood Banks</a></li>
            <li><a href="/find-hospital">Blood Donation Camps</a></li>
            <li><a href="#">Eligibility Criteria</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>Information</h3>
          <ul>
            <li><a href="#">About Blood Donation</a></li>
            <li><a href="#">Why Donate Blood</a></li>
            <li><a href="#">Donation Process</a></li>
            <li><a href="#">FAQs</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>Contact Us</h3>
          <ul>
            <li>Email: info@bloodconnect.org</li>
            <li>Phone: 1800-123-4567</li>
            <li>Address: 123 Health Street, Medical City</li>
            <li>Emergency: 102 (Ambulance)</li>
          </ul>
        </div>
      </div>
      <div className="copyright">
        <p>&copy; {new Date().getFullYear()} Blood Connect. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
