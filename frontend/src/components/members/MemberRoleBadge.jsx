import "./MemberBadges.css";

const ROLE_META = {
  OWNER: { label: "Owner", tone: "accent" },
  ADMIN: { label: "Admin", tone: "cyan" },
  MEMBER: { label: "Member", tone: "neutral" },
  /* lowercase fallbacks for safety */
  owner: { label: "Owner", tone: "accent" },
  admin: { label: "Admin", tone: "cyan" },
  member: { label: "Member", tone: "neutral" },
};

function MemberRoleBadge({ role = "MEMBER" }) {
  const meta = ROLE_META[role] || ROLE_META.MEMBER;

  return (
    <span className={`mb-badge mb-role tone-${meta.tone}`}>
      {meta.label}
    </span>
  );
}

export default MemberRoleBadge;