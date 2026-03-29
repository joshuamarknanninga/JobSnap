export const createCrudHandlers = (Model, populate = '') => {
  const list = async (req, res) => {
    const query = req.user.business ? { business: req.user.business } : {};
    const items = await Model.find(query).populate(populate).sort({ createdAt: -1 });
    return res.json(items);
  };

  const getById = async (req, res) => {
    const item = await Model.findById(req.params.id).populate(populate);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    return res.json(item);
  };

  const create = async (req, res) => {
    const payload = { ...req.body };
    if (req.user.business && !payload.business) {
      payload.business = req.user.business;
    }
    const item = await Model.create(payload);
    return res.status(201).json(item);
  };

  const update = async (req, res) => {
    const item = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    return res.json(item);
  };

  const remove = async (req, res) => {
    const item = await Model.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    return res.json({ message: 'Item removed' });
  };

  return { list, getById, create, update, remove };
};
