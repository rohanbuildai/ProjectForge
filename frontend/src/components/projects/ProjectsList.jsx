import ProjectCard from "./ProjectCard";
import ProjectsEmptyState from "./ProjectsEmptyState";
import "./ProjectsList.css";

function ProjectsList({ projects = [] }) {
  if (projects.length === 0) {
    return <ProjectsEmptyState />;
  }

  return (
    <div className="pr-grid">
      {projects.map((project) => (
        <ProjectCard key={project.id} {...project} />
      ))}
    </div>
  );
}

export default ProjectsList;