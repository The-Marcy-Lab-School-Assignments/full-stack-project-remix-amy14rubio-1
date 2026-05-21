import MilestoneCard from './MilestoneCard';

const MilestoneList = ({
  milestones,
  loadMilestones,
  entries,
  instruments,
  pieces,
  showControls,
}) => {
  return (
    <ul className='milestone-list'>
      {milestones.map((milestone) => (
        <MilestoneCard
          key={milestone.milestone_id}
          milestone={milestone}
          loadMilestones={loadMilestones}
          showControls={showControls}
          instruments={instruments}
          entries={entries}
          pieces={pieces}
        />
      ))}
    </ul>
  );
};

export default MilestoneList;
