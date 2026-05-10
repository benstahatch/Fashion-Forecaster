import React from 'react';
import { Link } from 'react-router-dom';
import './userProfile.css';

export default function UserProfile({ user, onLogout }) {
  const displayName =
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    "Fashion Student";

  const roleLabel =
    user?.user_metadata?.requested_role === "professor" ? "PROFESSOR" : "FASHION STUDENT";

  const savedPalettes = [
    { id: 1, name: "DESERT DUST", code: "14-1312 TCX", hex: "#dabe9a" },
    { id: 2, name: "PALE ORANGE", code: "12-0315 TSX", hex: "#ca905e" },
    { id: 3, name: "CLOUD DANCER", code: "19-4007 TPG", hex: "#f8f5f2" },
    { id: 4, name: "VINTAGE BLUSH", code: "13-1520 TCX", hex: "#974a7a" }
  ];
  
  return (
    <div className="profile-container">
      <nav className="profile-nav">
        <div className="brand-logo">STUDIO / WORKSPACE</div>
        <div className="nav-right">
          <button className="vogue-logout-btn" onClick={onLogout}>
            <span>EXIT SESSION</span>
          </button>
        </div>
      </nav>

      <main className="profile-main">
        <header className="profile-header">
          <p className="overline">STUDENT ARCHIVE</p>
          <h1 className="user-name" style={{textAlign: 'left'}}>{displayName}</h1>
          <p className="user-role">{roleLabel} — ID: 2026-X94</p>
          {user?.email && <p className="user-role">{user.email}</p>}
        </header>

        <section className="profile-section">
          <h2 className="section-title">SAVED COLOR FORECASTS</h2>
          <div className="pantone-grid">
            {savedPalettes.map(color => (
              <div key={color.id} className="pantone-card">
                <div className="color-swatch" style={{ backgroundColor: color.hex }}></div>
                <div className="pantone-info">
                  <p className="color-name">{color.name}</p>
                  <p className="color-code">{color.code}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="profile-section">
          <h2 className="section-title">LOCAL WORKSPACE</h2>
          <div className="collage-status-box">
            <p><strong>COLLAGE CREATOR:</strong> Local caching active. 
            All creations are saved directly to your Downloads 
            folder to optimize system performance.</p>
            <Link to="/collage"><button className='vogue-logout-btn'>CREATE</button></Link>
          </div>
        </section>
      </main>
    </div>
  );
}
