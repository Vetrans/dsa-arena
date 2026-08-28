import { Link } from 'react-router-dom';
export function NotFoundPage() { return <main className="not-found"><p className="eyebrow">404</p><h1>This page does not exist.</h1><Link className="button button-yellow" to="/">Go home</Link></main>; }
