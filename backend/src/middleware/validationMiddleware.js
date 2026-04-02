const normalizeString = (value) => (typeof value === 'string' ? value.trim() : '');

const ensureNumber = (value) => Number.isFinite(Number(value));

export const validateAuthPayload = (mode) => (req, res, next) => {
  const errors = [];
  const name = normalizeString(req.body.name);
  const businessName = normalizeString(req.body.businessName);
  const email = normalizeString(req.body.email);
  const password = normalizeString(req.body.password);

  if (!email) {
    errors.push('Email is required.');
  }

  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters.');
  }

  if (mode === 'register') {
    if (!name) {
      errors.push('Name is required.');
    }

    if (!businessName) {
      errors.push('Business name is required.');
    }
  }

  if (errors.length) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  next();
};

export const validateResourcePayload = (resource) => (req, res, next) => {
  const rules = {
    customers: () => {
      const errors = [];
      if (!normalizeString(req.body.name)) {
        errors.push('Customer name is required.');
      }
      return errors;
    },
    estimates: () => {
      const errors = [];
      if (!normalizeString(req.body.customer)) {
        errors.push('Customer is required.');
      }
      if (!normalizeString(req.body.title)) {
        errors.push('Title is required.');
      }
      const hasLineItems = Array.isArray(req.body.lineItems) && req.body.lineItems.length > 0;
      if (hasLineItems) {
        req.body.lineItems.forEach((item, index) => {
          if (!ensureNumber(item.qty) || Number(item.qty) <= 0) {
            errors.push(`lineItems[${index}].qty must be greater than 0.`);
          }
          if (!ensureNumber(item.rate) || Number(item.rate) < 0) {
            errors.push(`lineItems[${index}].rate must be 0 or higher.`);
          }
        });
      }

      const hasManualTotals = ensureNumber(req.body.subtotal) && ensureNumber(req.body.total);
      if (!hasLineItems && !hasManualTotals) {
        errors.push('Provide lineItems or valid subtotal/total values.');
      }
      return errors;
    },
    jobs: () => {
      const errors = [];
      if (!normalizeString(req.body.customer)) {
        errors.push('Customer is required.');
      }
      if (!normalizeString(req.body.scheduledDate)) {
        errors.push('Scheduled date is required.');
      }
      if (!normalizeString(req.body.address)) {
        errors.push('Address is required.');
      }
      return errors;
    },
    invoices: () => {
      const errors = [];
      if (!normalizeString(req.body.customer)) {
        errors.push('Customer is required.');
      }
      if (!normalizeString(req.body.invoiceNumber)) {
        errors.push('Invoice number is required.');
      }
      if (!normalizeString(req.body.dueDate)) {
        errors.push('Due date is required.');
      }
      const hasJob = Boolean(normalizeString(req.body.job));
      if (!hasJob && !ensureNumber(req.body.amount)) {
        errors.push('Amount is required when no job is attached.');
      }
      return errors;
    },
    businesses: () => {
      const errors = [];
      if (!normalizeString(req.body.name)) {
        errors.push('Business name is required.');
      }
      return errors;
    }
  };

  const validate = rules[resource];
  if (!validate) {
    return next();
  }

  const errors = validate();
  if (errors.length) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  next();
};
