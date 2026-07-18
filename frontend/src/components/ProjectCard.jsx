import "../styles/dashboard/ProjectCard.css"

function ProjectCard({ project, onEdit, onDelete }) {
    return (
        <div className="project-card">

            <div className="project-content">

                <h3 className="project-title">
                    {project.title}
                </h3>

                <p className="project-description">
                    {project.description}
                </p>

            </div>

            <div className="project-footer">

                <button
                    className="edit-btn"
                    onClick={onEdit}
                >
                    Edit
                </button>

                <button
                    className="delete-btn"
                    onClick={onDelete}
                >
                    Delete
                </button>

            </div>

        </div>
    );
}

export default ProjectCard;