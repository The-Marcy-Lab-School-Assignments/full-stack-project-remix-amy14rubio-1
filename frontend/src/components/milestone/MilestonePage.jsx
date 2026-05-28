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
  const [formReveal, setFormReveal] = useState(false);
  const handleCreate = () => {
    setFormReveal(true);
  };
  const handleCancel = () => {
    setFormReveal(false);
  };
  return (
    <main>
      <Navbar />
      <section>
        {!formReveal && (
          <div className='milestone-header'>
            <h1>MILESTONES</h1>
            <div>
              <button onClick={handleCreate} className={`create-entry`}>
                +
              </button>
            </div>
          </div>
        )}
        {formReveal && (
          <div className='milestone-container'>
            <MilestoneForm
              milestones={milestones}
              loadMilestones={loadMilestones}
              entries={entries}
              instruments={instruments}
              pieces={pieces}
              handleCancel={handleCancel}
            />
            <button onClick={handleCancel} className={`cancel-entry`}>
              x
            </button>
          </div>
        )}
        {isLoading && <p>Loading milestones...</p>}
        {error && <p className='error'>Something went wrong: {error}</p>}
        {!formReveal && (
          <div>
            <MilestoneList
              milestones={milestones}
              loadMilestones={loadMilestones}
              showControls={showControls}
            />
          </div>
        )}
      </section>
    </main>
  );
}

export default MilestonePage;
