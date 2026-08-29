import ProjectCard from "./ProjectCard";
import "./ProjectsList.css";

function toCardProps(project) {
  return {
    id: project.id,
    name: project.title,
    description: project.description,
    status: project.status,
    progress: project.progress,
    taskCount: project.task_count,
    completedTasks: project.completed_count,
    members: project.members || [],
    priority: project.priority,
    createdAt: project.created_at,
    updatedAt: project.updated_at,
  };
}

function ProjectsList({ projects = [], view = "grid" }) {
  return (
    <div className={`pr-grid ${view === "list" ? "pr-grid-list" : ""}`}>
      {projects.map((project) => (
        <ProjectCard key={project.id} {...toCardProps(project)} layout={view} />
      ))}
    </div>
  );
}

export default ProjectsList;