import Icon from "../landing/icons";
import MemberAvatar, { MemberAvatarStack } from "./MemberAvatar";
import MemberRoleBadge from "./MemberRoleBadge";
import MemberStatusBadge from "./MemberStatusBadge";
import MemberMenu from "./MemberMenu";
import { formatMemberDate } from "./memberDates";
import "./MembersGrid.css";

function MembersGrid({ members = [] }) {
  return (
    <div className="mb-grid" aria-label="Members grid">
      {members.map((member) => (
        <article className="dash-card mb-grid-card" key={member.id}>
          <header className="mb-grid-top">
            <MemberAvatar name={member.name} size={44} />
            <MemberMenu memberName={member.name} />
          </header>

          <h3 className="mb-grid-name">{member.name}</h3>
          <p className="mb-grid-email">{member.email}</p>

          <div className="mb-grid-badges">
            <MemberRoleBadge role={member.role} />
            <MemberStatusBadge status={member.status} />
          </div>

          <div className="mb-grid-stats">
            <span className="mb-grid-stat">
              <Icon name="folder" size={13} />
              <strong>{member.projects}</strong>
              {member.projects === 1 ? "project" : "projects"}
            </span>
            <span className="mb-grid-stat">
              <Icon name="task" size={13} />
              <strong>{member.tasks}</strong>
              {member.tasks === 1 ? "task" : "tasks"}
            </span>
          </div>

          <footer className="mb-grid-foot">
            <span className="mb-grid-joined">
              Joined{" "}
              <time dateTime={member.joined}>{formatMemberDate(member.joined)}</time>
            </span>
            <MemberAvatarStack
              names={[member.name, ...(member.peers || [])]}
              size={22}
              label={`${member.name} plus ${(member.peers || []).length} collaborator${(member.peers || []).length === 1 ? "" : "s"}`}
            />
          </footer>
        </article>
      ))}
    </div>
  );
}

export default MembersGrid;