import { useState, useEffect } from "react";
import "../styles/dashboard/ProjectModal.css";

function ProjectModal({ isCreating, setIsModalOpen, onSubmit, mode, project }) {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {

        if (mode === "edit" && project) {
            setTitle(project.title);
            setDescription(project.description);
        }

        if (mode === "create") {
            setTitle("");
            setDescription("");
        }

    }, [mode, project]);

    function handleSubmit(e) {

        e.preventDefault();

        onSubmit({
            title,
            description
        });

    }

    return (

        <div className="modal-overlay">

            <div className="modal">

                <h2>{mode === "create" ? "Create Project" : "Edit Project"}</h2>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">

                        <label>Project Title</label>

                        <input
                            type="text"
                            placeholder="Enter project title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>Description</label>

                        <textarea
                            placeholder="Enter project description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                    </div>

                    <div className="modal-buttons">

                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isCreating}
                            className="create-btn"
                        >
                            {isCreating
                                ? "Saving..."
                                : mode === "create"
                                    ? "Create Project"
                                    : "Save Changes"}
                        </button>

                    </div>

                </form>

            </div>

        </div>

    );
}

export default ProjectModal;