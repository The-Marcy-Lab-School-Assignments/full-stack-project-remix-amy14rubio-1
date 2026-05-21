import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  return (
    <nav className={`navbar ${location.pathname === '/entries' ? 'nav-entry' : ''}`}>
      <div className='logo'>
        <Link className='logo-link' to='/'>
          Music Journal App
        </Link>
      </div>
      <ul className='nav-links'>
        {/* <li>
          <NavLink to='/' end>
            Home
          </NavLink>
        </li> */}
        <li>
          <NavLink className='nav-link' to='/entries'>
            Entries
          </NavLink>
        </li>
        <li>
          <NavLink className='nav-link' to='/milestones'>
            Milestones
          </NavLink>
        </li>
        <li>
          <NavLink className='nav-link' to='/notes'>
            Notes
          </NavLink>
        </li>
        <li>
          <NavLink className='nav-link' to='/pieces'>
            Songs
          </NavLink>
        </li>
        <li className='profile'>
          {/* redirect to new page?? */}
          <a href='/profile' className='user-icon' className='nav-link'>
            {/* <NavLink to='/pieces'>Profile</NavLink> */}
            <i>account</i>
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
