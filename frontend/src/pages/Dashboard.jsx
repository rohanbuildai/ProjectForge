import { useState, useEffect } from "react";
import api from "../api/axios";
import NavBar from "../components/NavBar";
import "../styles/dashboard/Dashboard.css";
import ProjectModal from "../components/ProjectModal";

function Dashboard() {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [projects,setProjects] = useState()

    useEffect(() => {

        async function getCurrentUser() {

            try {

                const response = await api.get("/auth/me");
                console.log(response.data)

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



    async function handleCreateProject(projectData) {
        setIsCreating(true);

        try {
            const response = await api.post("/projects", projectData);

            await getProjects();

            setIsModalOpen(false);

            alert(response.data.message);
        } catch (error) {
            alert(error.response?.data?.message || "Project not created");
        } finally {
            setIsCreating(false);
        }
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

                    <button onClick={() => setIsModalOpen(true)}>
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

                <section className="recent-projects">

                    <h2>Recent Projects</h2>

                    <div className="empty-projects">

                        <h3>No Projects Yet</h3>

                        <p>
                            Create your first project to get started.
                        </p>

                        <button>
                            + Create First Project
                        </button>

                    </div>

                </section>

            </main>

            {isModalOpen && (
                <ProjectModal isCreating={isCreating}
                    setIsModalOpen={setIsModalOpen}
                    onSubmit={handleCreateProject}
                />
            )}

        </div>
    );
}

export default Dashboard;