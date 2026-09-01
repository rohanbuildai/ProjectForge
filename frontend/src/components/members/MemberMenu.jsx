import { useEffect, useRef, useState } from "react";
import Icon from "../landing/icons";
import "./MemberMenu.css";

function MemberMenu({
  member,
  currentUserRole,
  onChangeRole,
  onRemove,
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const memberName = member?.name || member?.email || "member";
  const memberRole = (member?.role || "").toUpperCase();
  const isOwner = currentUserRole === "OWNER";
  const targetIsOwner = memberRole === "OWNER";

  useEffect(() => {
    if (!open) return undefined;

    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClickOutside);

    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClickOutside);
    };
  }, [open]);

  /* Build menu items based on authorization */
  const items = [];

  if (isOwner && !targetIsOwner) {
    items.push({
      icon: "shield",
      label: "Change role",
      action: () => {
        setOpen(false);
        onChangeRole?.(member);
      },
    });
    items.push({
      icon: "x",
      label: "Remove member",
      danger: true,
      action: () => {
        setOpen(false);
        onRemove?.(member);
      },
    });
  }

  /* If no actions are available, don't render the menu button */
  if (items.length === 0) {
    return <span className="mb-menu-anchor" />;
  }

  return (
    <div className="mb-menu-anchor" ref={menuRef}>
      <button
        type="button"
        className={`mb-more ${open ? "is-open" : ""}`}
        aria-label={`More options for ${memberName}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <Icon name="more" size={17} />
      </button>

      {open && (
        <div className="mb-menu" role="menu" aria-label={`Actions for ${memberName}`}>
          {items.map((item) => (
            <button
              type="button"
              role="menuitem"
              className={`mb-menu-item ${item.danger ? "is-danger" : ""}`}
              key={item.label}
              onClick={item.action}
            >
              <Icon name={item.icon} size={14} />
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default MemberMenu;