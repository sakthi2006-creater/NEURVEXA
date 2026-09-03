export default function LogoMark({ size = 40, glow = false }) {
  return (
    <img
      src="/logo.webp"
      alt="NEURVEXA"
      className="logo-mark"
      style={{
        width: size,
        height: size,
        objectFit: "contain",
        display: "block",
        filter: glow ? "drop-shadow(0 0 26px rgba(0,229,255,0.45))" : undefined,
      }}
    />
  );
}
