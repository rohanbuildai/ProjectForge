import "./MemberBadges.css";

const STATUS_META = {
  active: { label: "Active", tone: "green" },
  pending: { label: "Pending", tone: "amber" },
  inactive: { label: "Inactive", tone: "neutral" },
  /* uppercase fallbacks */
  ACTIVE: { label: "Active", tone: "green" },
  PENDING: { label: "Pending", tone: "amber" },
  INACTIVE: { label: "Inactive", tone: "neutral" },
};

function MemberStatusBadge({ status = "active" }) {
  const meta = STATUS_META[status] || STATUS_META.active;

  return (
    <span className={`mb-badge mb-status tone-${meta.tone}`}>
      <span className="mb-badge-dot" aria-hidden="true" />
      {meta.label}
    </span>
  );
}

export default MemberStatusBadge;