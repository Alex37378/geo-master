import backgroundMap from "../images_hub/countries_background.png";

export default function Background() {
  return (
    <div
      className="background-map fixed inset-0 overflow-hidden pointer-events-none z-0"
      style={{
        backgroundImage: `url(${backgroundMap})`
      }}
    />
  );
}