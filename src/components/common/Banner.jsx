 // src/components/common/Banner.jsx
import bannerImage from "../../assets/front-page-banner.jpg";

export default function Banner() {
  return (
    <div className="banner-container">
      <img className="banner-image" src={bannerImage} alt="Blood donation banner" />
      <div className="banner-text">
        <h2>Join the Life-Saving Mission</h2>
        <p>Every blood donation is a gift of life. Register today to become a donor or find blood when in need.</p>
        <button className="cta-button">Register Now</button>
      </div>
    </div>
  );
}
