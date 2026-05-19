import { useState } from 'react';
import { deleteMilestone, updateMilestone } from '../../adapters/milestone-adapters';

import MilestoneDisplay from './MilestoneDisplay';
import MilestoneEditForm from './MilestoneEditForm';

const MilestoneCard = ({ milestone, loadMilestones, showControls }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: milestone.title,
    date: milestone.date.split('T')[0],
  });

  const handleDelete = async (e) => {
    const { error } = await deleteMilestone(milestone.milestone_id);
    if (error) return console.error(error);
    await loadMilestones();
  };

  const handleChange = async (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    setFormData({
      title: milestone.title,
      date: milestone.date.split('T')[0],
    });
    setIsEditing(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const { error } = await updateMilestone(
      formData.title,
      milestone.milestone_id,
      milestone.instrument,
    );
    if (error) return console.error(error);

    setIsEditing(false);
    await loadMilestones();
  };

  return isEditing ? (
    <MilestoneEditForm
      formData={formData}
      handleChange={handleChange}
      handleUpdate={handleUpdate}
      onCancel={handleCancel}
    />
  ) : (
    <MilestoneDisplay
      milestone={milestone}
      onDelete={handleDelete}
      onEdit={() => setIsEditing(true)}
      showControls={showControls}
    />
  );
};

export default MilestoneCard;
