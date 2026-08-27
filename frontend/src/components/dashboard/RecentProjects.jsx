import Icon from "../landing/icons";
import ProjectCard from "./ProjectCard";
import EmptyProjectsState from "./EmptyProjectsState";
import "./RecentProjects.css";

function RecentProjects({ projects = [] }) {
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

      {projects.length > 0 ? (
        <div className="projects-grid">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <EmptyProjectsState />
      )}
    </section>
  );
}

export default RecentProjects;