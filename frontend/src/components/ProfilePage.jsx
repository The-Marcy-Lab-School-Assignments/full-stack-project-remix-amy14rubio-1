import { useState, useEffect } from 'react';
// import EntryList from './entry/EntryList';
import Navbar from './Navbar';
// import MilestoneList from './milestone/MilestoneList';
// import NoteList from './note/NoteList';

function ProfilePage({ currentUser, handleLogout, instruments }) {
  return (
    <main>
      <Navbar />
      <section>
        <div id='user-controls'>
          {/* <h1 className='home-title'>
            Welcome, {currentUser.username[0].toUpperCase() + currentUser.username.slice(1)}!
          </h1> */}
          <button onClick={handleLogout}>Log Out</button>
          {/* add bio to database??*/}
        </div>
        {/* <div>{instruments}</div> */}
        {/* add instruments arr, how should the display look like for only one main instrument? or should there be no instrument display? */}
        {/* posts display or load no posts */}
      </section>
    </main>
  );
}

export default ProfilePage;
