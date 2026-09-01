import { getHue, getInitials } from "../dashboard/dashboardUtils";
import "./MemberAvatar.css";

function MemberAvatar({ name = "", size = 32, className = "", hue }) {
  const color = hue || getHue(name);

  return (
    <span
      className={`avatar mb-avatar ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.38),
        background: color,
      }}
      aria-hidden="true"
    >
      {getInitials(name)}
    </span>
  );
}

function MemberAvatarStack({ names = [], label = "", size = 24 }) {
  if (names.length === 0) return null;

  return (
    <div className="avatar-stack mb-avatar-stack" role="img" aria-label={label}>
      {names.slice(0, 4).map((name, index) => (
        <span
          key={`${name}-${index}`}
          className="avatar mb-stack-avatar"
          style={{
            width: size,
            height: size,
            fontSize: Math.round(size * 0.4),
            background: getHue(name),
          }}
        >
          {getInitials(name)}
        </span>
      ))}
      {names.length > 4 && (
        <span className="avatar-more mb-stack-more" style={{ width: size, height: size }}>
          +{names.length - 4}
        </span>
      )}
    </div>
  );
}

export { MemberAvatar, MemberAvatarStack };
export default MemberAvatar;