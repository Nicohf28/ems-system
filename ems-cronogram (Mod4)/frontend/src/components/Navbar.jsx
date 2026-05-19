import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  const loc = useLocation()
  const links = [
    { to: '/', label: 'Tareas' },
    { to: '/ccm', label: 'Análisis CCM' },
  ]
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-tag">EQ.3</span>
        <span className="brand-name">CRONOGRAMA <span className="brand-sub">CCM</span></span>
      </div>
      <div className="navbar-links">
        {links.map(l => (
          <Link key={l.to} to={l.to} className={`nav-link ${loc.pathname === l.to ? 'active' : ''}`}>
            {l.label}
          </Link>
        ))}
      </div>
      <div className="navbar-port">
        <span className="port-label">PORT</span>
        <span className="port-value">3003</span>
      </div>
    </nav>
  )
}
