import Icon from "../landing/icons";
import { CURRENT_USER } from "./mockData";
import "./WelcomeSection.css";
import { useEffect, useState } from "react";
import api from "../../api/axios";

function WelcomeSection() {

  const [user, setUser] = useState(null);


  useEffect(() => {
  const fetchUser = async () => {
    try {
      const response = await api.get("/auth/me");

      setUser(response.data);
    } catch (error) {
      console.error("Failed to fetch current user:", error);
    }
  };

  fetchUser();
}, []);


  return (
    <section className="dash-section welcome" aria-label="Welcome">
      <div className="welcome-copy">
        <p className="welcome-eyebrow">Wednesday, August 26</p>
        <h2 className="welcome-title">
          Good morning, {user?.data?.name}
          <span className="welcome-wave" aria-hidden="true">
            &#128075;
          </span>
        </h2>
        <p className="welcome-sub">Here's what's happening across your workspace today.</p>
      </div>

      <div className="welcome-actions">
        <button type="button" className="pf-btn pf-btn-ghost welcome-btn">
          <Icon name="users" size={15} className="welcome-btn-icon" />
          Invite member
        </button>
        <button type="button" className="pf-btn pf-btn-ghost welcome-btn">
          <Icon name="plus" size={15} className="welcome-btn-icon" />
          New task
        </button>
        <button type="button" className="pf-btn pf-btn-primary welcome-btn">
          <Icon name="plus" size={15} className="welcome-btn-icon" />
          New project
        </button>
      </div>
    </section>
  );
}

export default WelcomeSection;