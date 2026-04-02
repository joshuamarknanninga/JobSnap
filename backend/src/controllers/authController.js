import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Business from '../models/Business.js';

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

export const registerUser = async (req, res) => {
  const { name, email, password, businessName } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = await User.create({ name, email, password });

  const business = await Business.create({
    owner: user._id,
    name: businessName || `${name.split(' ')[0]}'s Cleaning`
  });

  user.business = business._id;
  await user.save();

  return res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    business: business,
    token: generateToken(user._id)
  });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).populate('business');

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  return res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    business: user.business,
    token: generateToken(user._id)
  });
};

export const getMe = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password').populate('business');
  return res.json(user);
};
