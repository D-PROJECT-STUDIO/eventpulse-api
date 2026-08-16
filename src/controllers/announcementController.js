import Event from '../models/Event.js';
import Message from '../models/Message.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const createAnnouncement = asyncHandler(async (req, res, next) => {
  const event = await Event.exists({ _id: req.body.eventId });
  if (!event) return next(new AppError('Event not found', 404));

  const message = await Message.create({
    event: req.body.eventId,
    sender: req.user.id,
    text: req.body.text
  });
  await message.populate('sender', 'name email role');

  const io = req.app.get('io');
  if (io) io.to(req.body.eventId).emit('announcement', message);

  res.status(201).json({ status: 'success', data: message });
});

export const getAnnouncements = asyncHandler(async (req, res, next) => {
  const event = await Event.exists({ _id: req.params.eventId });
  if (!event) return next(new AppError('Event not found', 404));

  const messages = await Message.find({ event: req.params.eventId })
    .populate('sender', 'name email role')
    .sort({ createdAt: 1 });
  res.json({ status: 'success', data: messages });
});
