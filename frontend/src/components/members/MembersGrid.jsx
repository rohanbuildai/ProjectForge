import Icon from "../landing/icons";
import MemberAvatar from "./MemberAvatar";
import MemberRoleBadge from "./MemberRoleBadge";
import MemberStatusBadge from "./MemberStatusBadge";
import MemberMenu from "./MemberMenu";
import { formatMemberDate } from "./memberDates";
import "./MembersGrid.css";

function MembersGrid({ members = [], currentUserRole, onChangeRole, onRemove }) {
  return (
    <div className="mb-grid" aria-label="Members grid">
      {members.map((member) => {
        const memberName = member.name || member.email || "Unknown member";
        const projects = member.projects ?? 0;
        const tasks = member.tasks ?? 0;

        return (
          <article className="dash-card mb-grid-card" key={member.id}>
            <header className="mb-grid-top">
              <MemberAvatar name={memberName} size={44} />
              <MemberMenu
                member={member}
                currentUserRole={currentUserRole}
                onChangeRole={onChangeRole}
                onRemove={onRemove}
              />
            </header>

            <h3 className="mb-grid-name">{memberName}</h3>
            <p className="mb-grid-email">{member.email}</p>

            <div className="mb-grid-badges">
              <MemberRoleBadge role={member.role} />
              <MemberStatusBadge status={member.status} />
            </div>

            <div className="mb-grid-stats">
              <span className="mb-grid-stat">
                <Icon name="folder" size={13} />
                <strong>{projects}</strong>
                {projects === 1 ? "project" : "projects"}
              </span>
              <span className="mb-grid-stat">
                <Icon name="task" size={13} />
                <strong>{tasks}</strong>
                {tasks === 1 ? "task" : "tasks"}
              </span>
            </div>

            <footer className="mb-grid-foot">
              <span className="mb-grid-joined">
                Joined{" "}
                <time dateTime={member.joined}>{formatMemberDate(member.joined)}</time>
              </span>
            </footer>
          </article>
        );
      })}
    </div>
  );
}

export default MembersGrid;