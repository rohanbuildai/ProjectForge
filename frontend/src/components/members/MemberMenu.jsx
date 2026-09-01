import { useEffect, useRef, useState } from "react";
import Icon from "../landing/icons";
import "./MemberMenu.css";

const MENU_ITEMS = [
  { icon: "eye", label: "View profile" },
  { icon: "settings", label: "Edit member" },
  { icon: "shield", label: "Manage role" },
  { icon: "mail", label: "Resend invite" },
  { icon: "x", label: "Remove member", danger: true },
];

function MemberMenu({ memberName = "member" }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

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
          {MENU_ITEMS.map((item) => (
            <button
              type="button"
              role="menuitem"
              className={`mb-menu-item ${item.danger ? "is-danger" : ""}`}
              key={item.label}
              onClick={() => setOpen(false)}
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