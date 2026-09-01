import Icon from "../landing/icons";
import "./MembersHeader.css";

function MembersHeader({ workspaceName }) {
  return (
    <section className="mb-page-head" aria-labelledby="members-title">
      <div className="mb-page-copy">
        <p className="mb-breadcrumb">
          <span className="mb-breadcrumb-dot" aria-hidden="true" />
          {workspaceName || "Workspace"} <span aria-hidden="true">/</span> Members
        </p>
        <h1 className="mb-page-title" id="members-title">
          Members
        </h1>
        <p className="mb-page-sub">
          Manage your workspace members, roles, and access.
        </p>
      </div>

      <button type="button" className="pf-btn pf-btn-primary mb-page-action">
        <Icon name="plus" size={15} />
        Invite member
      </button>
    </section>
  );
}

export default MembersHeader;