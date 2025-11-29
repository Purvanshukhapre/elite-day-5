import "./loader.css";

export default function Loader({ size = 22, color = "#ffffff" }) {
  return (
    <div
      className="spinner"
      style={{
        width: size,
        height: size,
        borderColor: color,
        borderBottomColor: "transparent",
      }}
    />
  );
}