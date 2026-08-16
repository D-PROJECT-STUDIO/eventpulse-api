import Event from '../models/Event.js';
import '../models/Category.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getEvents = asyncHandler(async (req, res) => {
  const { category, city, startDate, endDate, search } = req.query;
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);
  const filter = {};

  if (category) filter.category = category;
  if (city) filter.city = { $regex: `^${city}$`, $options: 'i' };
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  const allowedSortFields = ['date', 'registrations'];
  const sortBy = allowedSortFields.includes(req.query.sortBy) ? req.query.sortBy : 'date';
  const order = req.query.order === 'desc' ? -1 : 1;
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    Event.find(filter)
      .populate('category')
      .populate('organizer', 'name email role')
      .sort({ [sortBy]: order })
      .skip(skip)
      .limit(limit),
    Event.countDocuments(filter)
  ]);

  res.json({
    status: 'success',
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    data
  });
});

export const getEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id)
    .populate('category')
    .populate('organizer', 'name email role');
  if (!event) return next(new AppError('Event not found', 404));
  res.json({ status: 'success', data: event });
});

export const createEvent = asyncHandler(async (req, res) => {
  const event = await Event.create({ ...req.body, organizer: req.user.id });
  await event.populate('category');
  res.status(201).json({ status: 'success', data: event });
});

export const updateEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).populate('category');
  if (!event) return next(new AppError('Event not found', 404));
  res.json({ status: 'success', data: event });
});

export const deleteEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findByIdAndDelete(req.params.id);
  if (!event) return next(new AppError('Event not found', 404));
  res.status(204).end();
});
