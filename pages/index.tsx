import Link from 'next/link';

export default function Home() {
  const weeks = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="page">
      <header>
        <h1>Photography100</h1>
        <p>Weekly slides and student photo uploads — one week per page.</p>
      </header>

      <section className="card">
        <h2>Weeks</h2>
        <ul className="week-list">
          {weeks.map((w) => (
            <li key={w}>
              <Link href={`/week/${w}`}>Week {w}</Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h2>Teacher</h2>
        <p>
          <Link href="/teacher/dashboard">Teacher dashboard</Link>
        </p>
      </section>

      <footer className="muted">
        <p>Logged-in users can upload photos on the week page. Max 20 photos/week.</p>
      </footer>
    </div>
  );
}
