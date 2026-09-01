import MemberAvatar from "./MemberAvatar";
import MemberRoleBadge from "./MemberRoleBadge";
import MemberStatusBadge from "./MemberStatusBadge";
import MemberMenu from "./MemberMenu";
import { formatMemberDate } from "./memberDates";
import "./MemberRow.css";

function MemberRow({ member, currentUserRole, onChangeRole, onRemove }) {
  const memberName = member.name || member.email || "Unknown member";

  return (
    <div className="mb-row">
      <div className="mb-member">
        <MemberAvatar name={memberName} size={34} />
        <span className="mb-member-meta">
          <strong className="mb-member-name">{memberName}</strong>
          <span className="mb-member-email">{member.email}</span>
        </span>
      </div>

      <div className="mb-role-cell">
        <MemberRoleBadge role={member.role} />
      </div>

      <span className="mb-count">{member.projects ?? 0}</span>
      <span className="mb-count">{member.tasks ?? 0}</span>

      <div className="mb-status-cell">
        <MemberStatusBadge status={member.status} />
      </div>

      <time className="mb-joined" dateTime={member.joined}>
        {formatMemberDate(member.joined)}
      </time>

      <MemberMenu
        member={member}
        currentUserRole={currentUserRole}
        onChangeRole={onChangeRole}
        onRemove={onRemove}
      />
    </div>
  );
}

export default MemberRow;