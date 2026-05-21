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
  const handleForm = () => {
    setFormReveal((prev) => !prev);
  };
  return (
    <main>
      <Navbar />
      <section>
        <div className='milestone-container'>
          {formReveal && (
            <MilestoneForm
              milestones={milestones}
              loadMilestones={loadMilestones}
              entries={entries}
              instruments={instruments}
              pieces={pieces}
              handleForm={handleForm}
            />
          )}
          <button
            onClick={handleForm}
            className={`create-milestone ${formReveal ? 'cancel-milestone' : ''}`}
          >
            {formReveal ? 'x' : 'Create Milestone'}
          </button>
        </div>
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
