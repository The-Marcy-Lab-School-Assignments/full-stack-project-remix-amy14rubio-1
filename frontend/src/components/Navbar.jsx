import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

// change navbar, re-organize for adding the social media aspect of the app
//probably 2 modes, one for inspo and the other for documentation
//both inspo and documentation should have a home page

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
            Pieces
          </NavLink>
        </li>
        <li className='profile'>
          {/* is redirecting to a new page better?? */}
          {/* <a href='/profile' className='user-icon' className='nav-link'>
            <i>account</i>
          </a> */}
          <NavLink className='nav-link' to='/profile'>
            profile
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
