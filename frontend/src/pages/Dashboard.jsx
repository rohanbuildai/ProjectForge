import { useState, useEffect } from "react";
import api from "../api/axios";
import NavBar from "../components/NavBar";
import "../styles/dashboard/Dashboard.css";
import ProjectModal from "../components/ProjectModal";
import ProjectCard from "../components/ProjectCard";

function Dashboard() {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [projects, setProjects] = useState([])
    const [mode, setMode] = useState("create");
    const [selectedProject, setSelectedProject] = useState(null);

    useEffect(() => {

        async function getCurrentUser() {

            try {

                const response = await api.get("/auth/me");

                setUser(response.data.data);

            }
            catch (error) {

                console.error(error);

            }
            finally {

                setLoading(false);

            }

        }

        getCurrentUser();
        getProjects()

    }, []);

    if (loading) {
        return <h2>Loading...</h2>;
    }



    async function getProjects() {
        try {
            const response = await api.get("/projects");
            setProjects(response.data.data);
        } catch (error) {
            console.error(error);
            alert("Failed to fetch projects");
        }
    }



    async function handleSubmitProject(projectData) {
        setIsCreating(true);

        try {

            let response;

            if (mode === "create") {

                response = await api.post("/projects", projectData);

            } else {

                response = await api.put(
                    `/projects/${selectedProject.id}`,
                    projectData
                );

            }

            await getProjects();

            setIsModalOpen(false);

            alert(response.data.message);

        } catch (error) {

            alert(error.response?.data?.message || "Operation failed");

        } finally {

            setIsCreating(false);

        }
    }


    async function handleDeleteProject(id) {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this project?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            const response = await api.delete(`/projects/${id}`);

            alert(response.data.message);

        } catch (error) {

            alert(error.response?.data?.message || "Failed to delete project");

        }

        await getProjects();

    }

    return (
        <div className="dashboard">

            <NavBar user={user} />

            <main className="dashboard-content">

                {/* Welcome Section */}

                <section className="welcome-section">

                    <h1>
                        Welcome Back, {user.name} 👋
                    </h1>

                    <p>
                        Build, manage and deploy your AI-powered projects from one place.
                    </p>

                </section>

                {/* Quick Actions */}

                <section className="quick-actions">

                    <button onClick={() => { setIsModalOpen(true), setMode("create"), setSelectedProject(null) }}>
                        + New Project
                    </button>

                    <button>
                        View Projects
                    </button>

                    <button>
                        AI Assistant
                    </button>

                </section>

                {/* Overview */}

                <section className="overview">

                    <h2>Overview</h2>

                    <div className="overview-cards">

                        <div className="card">
                            <h3>Projects</h3>
                            <p>0</p>
                        </div>

                        <div className="card">
                            <h3>Completed</h3>
                            <p>0</p>
                        </div>

                        <div className="card">
                            <h3>AI Tasks</h3>
                            <p>0</p>
                        </div>

                        <div className="card">
                            <h3>Storage</h3>
                            <p>0 MB</p>
                        </div>

                    </div>

                </section>

                {/* Recent Projects */}

                {/* Recent Projects */}

                <section className="recent-projects">

                    <h2>Recent Projects</h2>

                    {projects.length === 0 ? (

                        <div className="empty-projects">

                            <h3>No Projects Yet</h3>

                            <p>
                                Create your first project to get started.
                            </p>

                            <button onClick={() => {
                                setMode("create");
                                setSelectedProject(null);
                                setIsModalOpen(true);
                            }}>
                                + Create First Project
                            </button>

                        </div>

                    ) : (

                        <div className="projects-container">

                            {projects.map((project) => (
                                <ProjectCard
                                    key={project.id}
                                    project={project}
                                    onEdit={() => {
                                        setMode("edit");
                                        setSelectedProject(project);
                                        setIsModalOpen(true);
                                    }}
                                    onDelete={() => handleDeleteProject(project.id)}
                                />
                            ))}

                        </div>

                    )}

                </section>

            </main>

            {isModalOpen && (
                <ProjectModal isCreating={isCreating}
                    setIsModalOpen={setIsModalOpen}
                    onSubmit={handleSubmitProject}
                    mode={mode}
                    project={selectedProject}
                />
            )}

        </div>
    );
}

export default Dashboard;