import { Link, NavLink, Navigate, Outlet } from 'react-router-dom';
import logo from '../../assets/nyc-logo.jpg';
import { useDemoAuth } from '../../store/demoAuthStore.js';
import { Footer } from './Footer.jsx';
const links = [['Dashboard','/dashboard'],['Problems','/problems'],['Contests','/contests'],['Leaderboard','/leaderboard'],['Roadmap','/roadmap'],['Community','/discussions']];
export function AppShell() { const { user, logout } = useDemoAuth(); if (!user) return <Navigate to="/login" replace />; return <div><header className="site-header app-header"><Link className="brand" to="/dashboard"><img src={logo} alt="Not Your College"/><span>DSA Arena</span></Link><nav>{links.map(([label,to]) => <NavLink key={to} to={to}>{label}</NavLink>)}</nav><div className="header-actions"><Link className="user-chip" to={`/profile/${user.username}`}>@{user.username}</Link><button className="text-button" onClick={logout}>Log out</button></div></header><main className="app-main"><Outlet /></main><Footer /></div>; }
