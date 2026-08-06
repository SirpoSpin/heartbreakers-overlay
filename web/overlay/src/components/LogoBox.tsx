import HeartbreakersLogo from "../images/heartbreakerslogonobg.png";

export default function LogoBox() {
  return (
    <div className="logo-box blue-gradient">
      <img
        src={HeartbreakersLogo}
        alt="Heartbreakers Logo"
        className="logo-img"
      />
    </div>
  );
}
