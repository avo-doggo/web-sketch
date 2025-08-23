import { Link } from "react-router-dom";

export function Navbar({ isOpen, onClose }) {
  if (!isOpen) return null; // sidebar disappears when closed

  return (
    <div className="sidebar">
      <button className="close-btn" onClick={onClose}>×</button>
      <Link to="/"><button onClick={onClose}>Home</button></Link>
      <Link to="/About"><button onClick={onClose}>About</button></Link>
      <Link to="/Help"><button onClick={onClose}>Help</button></Link>
      <Link to="/Account"><button onClick={onClose}>Account</button></Link>
      <Link to="/Canvas"><button onClick={onClose}>Canvas</button></Link>
      <Link to="/Works"><button onClick={onClose}>Works</button></Link>
    </div>
  );
}
