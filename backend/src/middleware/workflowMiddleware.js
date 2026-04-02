const canTransition = (transitions, from, to) => {
  if (!to || to === from) {
    return true;
  }

  const allowed = transitions[from] || [];
  return allowed.includes(to);
};

const createStatusTransitionGuard = (Model, transitions) => async (req, res, next) => {
  const requestedStatus = req.body.status;

  if (!requestedStatus) {
    return next();
  }

  const scope = { _id: req.params.id };
  if (req.user.business) {
    scope.business = req.user.business;
  }

  const item = await Model.findOne(scope).select('status');
  if (!item) {
    return res.status(404).json({ message: 'Item not found' });
  }

  if (!canTransition(transitions, item.status, requestedStatus)) {
    return res.status(400).json({
      message: `Invalid status transition from ${item.status} to ${requestedStatus}.`
    });
  }

  next();
};

export default createStatusTransitionGuard;
