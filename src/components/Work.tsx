import "./styles/Work.css";
import WorkImage from "./WorkImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { FaGithub } from "react-icons/fa6";
import { MdArrowOutward } from "react-icons/md";

gsap.registerPlugin(useGSAP);

const projects = [
  {
    name: "SyncLab",
    category: "Real-Time Code Collaboration",
    tools: "React, NestJS, Docker, WebSocket, Operational Transformation",
    image: "/images/synclab.webp",
    liveLink: "https://synclab-x6i4.onrender.com/",
    githubLink: "https://github.com/Omfarakate/SyncLab",
  },
  {
    name: "Production Planning",
    category: "Manufacturing SaaS Platform",
    tools: "Next.js, NestJS, MySQL, Redis, Rate Limiting, REST APIs",
    image: "/images/production_planning.webp",
    githubLink: "https://github.com/Omfarakate",
  },
  {
    name: "Enterprise CRM Engine",
    category: "Dynamic Custom Fields",
    tools: "Next.js, NestJS, MongoDB, MERN, JWT, RBAC",
    image: "/images/crm_platform.webp",
    githubLink: "https://github.com/Omfarakate",
  },
  {
    name: "URL Shortener Service",
    category: "High-Traffic Microservice",
    tools: "NestJS, Base62 Encoding, Redis, Load Balancing, Docker",
    image: "/images/url_shortener.webp",
    githubLink: "https://github.com/Omfarakate",
  },
];

const Work = () => {
  useGSAP(() => {
    let translateX: number = 0;

    function setTranslateX() {
      const box = document.getElementsByClassName("work-box");
      if (!box || box.length === 0) return;
      const container = document.querySelector(".work-container");
      if (!container) return;
      const rectLeft = container.getBoundingClientRect().left;
      const rect = box[0].getBoundingClientRect();
      const parent = box[0].parentElement;
      if (!parent) return;
      const parentWidth = parent.getBoundingClientRect().width;
      let padding: number =
        parseInt(window.getComputedStyle(box[0]).padding) / 2;
      translateX = rect.width * box.length - (rectLeft + parentWidth) + padding;
    }

    setTranslateX();

    let timeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".work-section",
        start: "top top",
        end: `+=${translateX}`, // Use actual scroll width
        scrub: true,
        pin: true,
        id: "work",
      },
    });

    timeline.to(".work-flex", {
      x: -translateX,
      ease: "none",
    });

    return () => {
      timeline.kill();
      ScrollTrigger.getById("work")?.kill();
    };
  }, []);

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          My <span>Work</span>
        </h2>
        <div className="work-flex">
          {projects.map((project, index) => (
            <div className="work-box" key={index}>
              <div className="work-info">
                <div className="work-title">
                  <h3>0{index + 1}</h3>

                  <div>
                    <h4>{project.name}</h4>
                    <p>{project.category}</p>
                  </div>
                </div>
                <h4>Tools and features</h4>
                <p>{project.tools}</p>
                <div className="work-actions">
                  {project.liveLink && (
                    <a
                      href={project.liveLink}
                      target="_blank"
                      rel="noreferrer"
                      className="work-btn work-btn-live"
                      data-cursor="disable"
                    >
                      Live Demo <MdArrowOutward />
                    </a>
                  )}
                  {project.githubLink && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noreferrer"
                      className="work-btn work-btn-github"
                      data-cursor="disable"
                    >
                      <FaGithub /> Code
                    </a>
                  )}
                </div>
              </div>
              <WorkImage
                image={project.image}
                alt={project.name}
                link={project.liveLink || project.githubLink}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;
