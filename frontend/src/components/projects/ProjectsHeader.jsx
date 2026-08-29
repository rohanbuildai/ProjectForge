import Icon from "../landing/icons";
import "./ProjectsHeader.css";

function ProjectsHeader({ workspaceName, onCreateProject }) {
  return (
    <section className="pr-page-head" aria-labelledby="projects-title">
      <div className="pr-page-copy">
        <p className="pr-breadcrumb">
          <span className="pr-breadcrumb-dot" aria-hidden="true" />
          {workspaceName || "Workspace"} <span aria-hidden="true">/</span> Projects
        </p>
        <h1 className="pr-page-title" id="projects-title">
          Projects
        </h1>
        <p className="pr-page-sub">
          Manage and track the work happening across your workspace.
        </p>
      </div>

      <button
        type="button"
        className="pf-btn pf-btn-primary pr-page-action"
        onClick={onCreateProject}
      >
        <Icon name="plus" size={15} />
        New Project
      </button>
    </section>
  );
}

export default ProjectsHeader;