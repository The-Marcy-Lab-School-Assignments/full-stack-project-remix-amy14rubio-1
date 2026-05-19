import { useState, useEffect } from 'react';
import MilestoneForm from './MilestoneForm';
import MilestoneList from './MilestoneList';
import Navbar from '../Navbar';

function MilestonePage({
  currentUser,
  entries,
  instruments,
  pieces,
  milestones,
  loadMilestones,
  isLoading,
  error,
  showControls,
}) {
  return (
    <main>
      <Navbar />
      <section>
        <div id='user-controls'>
          <span>
            Welcome, <strong>{currentUser.username}</strong>!
          </span>
        </div>
        <MilestoneForm
          milestones={milestones}
          loadMilestones={loadMilestones}
          entries={entries}
          instruments={instruments}
          pieces={pieces}
        />
        {isLoading && <p>Loading milestones...</p>}
        {error && <p className='error'>Something went wrong: {error}</p>}
        <h2>Past Milestones </h2>
        <MilestoneList
          milestones={milestones}
          loadMilestones={loadMilestones}
          showControls={showControls}
        />
      </section>
    </main>
  );
}

export default MilestonePage;
