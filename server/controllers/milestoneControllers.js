const milestoneModel = require('../models/milestoneModel');

module.exports.listMilestones = async (req, res, next) => {
  try {
    const milestones = await milestoneModel.listByUser(req.session.user_id);
    res.send(milestones);
  } catch (err) {
    next(err);
  }
};

module.exports.createMilestone = async (req, res, next) => {
  try {
    const { instrument_id, entry_id, piece_id, title, date } = req.body;
    if (!title || !date) return res.status(400).send({ error: 'Title and date are required.' });
    const milestone = await milestoneModel.create(
      req.session.user_id,
      instrument_id,
      entry_id,
      piece_id,
      title,
      date,
    );
    res.status(201).send(milestone);
  } catch (err) {
    next(err);
  }
};

module.exports.updateMilestone = async (req, res, next) => {
  try {
    const { milestone_id } = req.params;
    const { title } = req.body;
    const milestone = await milestoneModel.find(milestone_id);
    if (!milestone) return res.status(404).send({ error: 'Milestone not found.' });
    if (milestone.user_id !== req.session.user_id) {
      return res.status(403).send({ error: 'Not authorized.' });
    }
    const updatedMilestone = await milestoneModel.update(milestone_id, title);
    res.send(updatedMilestone);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteMilestone = async (req, res, next) => {
  try {
    const { milestone_id } = req.params;

    // First find the milestone to verify ownership
    const milestone = await milestoneModel.find(milestone_id);
    if (!milestone) return res.status(404).send({ error: 'Milestone not found.' });
    if (milestone.user_id !== req.session.user_id) {
      return res.status(403).send({ error: 'Not authorized.' });
    }

    // Destroy the milestone only after ownership has been verified
    const destroyedMilestone = await milestoneModel.destroy(milestone_id);
    res.send(destroyedMilestone);
  } catch (err) {
    next(err);
  }
};
