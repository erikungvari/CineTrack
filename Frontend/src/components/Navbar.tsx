import React, { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

interface NavbarProps {
  userId: string;
  setUserId: (id: string) => void;
}

interface UserOption {
  id: string;
  name: string;
}

const USERS: UserOption[] = [
  { id: '11111111-1111-1111-1111-111111111111', name: 'Alice' },
  { id: '22222222-2222-2222-2222-222222222222', name: 'Bob' },
  { id: '33333333-3333-3333-3333-333333333333', name: 'Charlie' },
];

function Navbar({ userId, setUserId }: NavbarProps): React.ReactElement {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const navigate = useNavigate();

  const currentUser = USERS.find((u) => u.id === userId) || USERS[0];

  const handleSearch = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          CineTrack
        </Link>
        <div className="navbar-links">
          <Link to="/">Domov</Link>
          <Link to="/search">Katalog</Link>
          <Link to="/recommendations">Doporuceni</Link>
          <Link to="/profile">Profil</Link>
        </div>
      </div>
      <div className="navbar-right">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Hledat tituly..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </form>
        <select
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="user-select"
        >
          {USERS.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
      </div>
    </nav>
  );
}

export default Navbar;
