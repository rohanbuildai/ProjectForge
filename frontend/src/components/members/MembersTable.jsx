import MemberRow from "./MemberRow";
import "./MembersTable.css";

function MembersTable({ members = [], currentUserRole, onChangeRole, onRemove }) {
  return (
    <div className="dash-card mb-table" role="table" aria-label="Members">
      <div className="mb-th" role="row" aria-hidden="true">
        <span>Member</span>
        <span>Role</span>
        <span>Projects</span>
        <span>Tasks</span>
        <span>Status</span>
        <span>Joined</span>
        <span />
      </div>

      <div>
        {members.map((member) => (
          <MemberRow
            key={member.id}
            member={member}
            currentUserRole={currentUserRole}
            onChangeRole={onChangeRole}
            onRemove={onRemove}
          />
        ))}
      </div>
    </div>
  );
}

export default MembersTable;