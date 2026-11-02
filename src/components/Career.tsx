import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Software Engineer</h4>
                <h5>Hidden Brains Infotech</h5>
              </div>
              <h3>NOW</h3>
            </div>
            <p>
              Built and shipped 2+ full-stack features for a production SaaS
              application using MERN, Next.js, and NestJS for 1,000+ active
              users. Designed 30+ RESTful APIs with JWT & RBAC, cutting response
              times by 36%. Architected a base62 URL shortener and a dynamic
              custom field engine across 20+ CRM products.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>B.Tech in Data Science</h4>
                <h5>DKTE Textile & Eng. Institute</h5>
              </div>
              <h3>2026</h3>
            </div>
            <p>
              Bachelor of Technology in Data Science (CGPA: 8.10/10). Focused on
              data structures, algorithms, machine learning pipelines, and
              database architecture.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>B.Tech in Computer Engineering</h4>
                <h5>DKTE Textile & Eng. Institute</h5>
              </div>
              <h3>2026</h3>
            </div>
            <p>
              Bachelor of Technology in Computer Engineering (CGPA: 7.81/10).
              Solved 180+ problems on LeetCode with strong algorithmic
              foundation and earned the LeetCode Consistency Badge.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
