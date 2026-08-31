import "../../styles/avatar.css";


function Avatar({
  name,
  avatarPath,
  type = "student",
  size = "medium",
}) {
  const initial =
    name
      ? name
          .trim()
          .charAt(0)
          .toUpperCase()
      : "?";


  const className = [
    "user-avatar",
    `user-avatar-${type}`,
    `user-avatar-${size}`,
  ].join(" ");


  if (avatarPath) {
    return (
      <div className={className}>

        <img
          src={avatarPath}
          alt={`${name || "ユーザー"}のアイコン`}
        />

      </div>
    );
  }


  return (
    <div
      className={className}
      aria-label={`${name || "ユーザー"}のアイコン`}
    >

      <span>
        {initial}
      </span>

    </div>
  );
}


export default Avatar;