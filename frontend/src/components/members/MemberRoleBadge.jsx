import "./MemberBadges.css";

const ROLE_META = {
  owner: { label: "Owner", tone: "accent" },
  admin: { label: "Admin", tone: "cyan" },
  member: { label: "Member", tone: "neutral" },
};

function MemberRoleBadge({ role = "member" }) {
  const meta = ROLE_META[role] || ROLE_META.member;

  return (
    <span className={`mb-badge mb-role tone-${meta.tone}`}>
      {meta.label}
    </span>
  );
}

export default MemberRoleBadge;