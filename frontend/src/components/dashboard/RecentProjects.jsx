import Icon from "../landing/icons";
import { PROJECTS } from "./mockData";
import ProjectCard from "./ProjectCard";
import "./RecentProjects.css";

function RecentProjects() {
  return (
    <section className="dash-section" aria-labelledby="recent-projects-title">
      <div className="dash-section-head">
        <h2 className="dash-section-title" id="recent-projects-title">
          Recent Projects
        </h2>
        <button type="button" className="dash-view">
          View all
          <Icon name="arrowRight" size={14} />
        </button>
      </div>

      <div className="projects-grid">
        {PROJECTS.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </div>
    </section>
  );
}

export default RecentProjects;