import Event from '../models/Event.js';
import Registration from '../models/Registration.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const registerForEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.body.eventId);
  if (!event) return next(new AppError('Event not found', 404));

  const existing = await Registration.findOne({ event: event._id, attendee: req.user.id });
  if (existing) return next(new AppError('You are already registered for this event', 400));

  const currentCount = await Registration.countDocuments({ event: event._id });
  if (currentCount >= event.capacity) return next(new AppError('This event is full', 400));

  const registration = await Registration.create({ event: event._id, attendee: req.user.id });
  await Event.findByIdAndUpdate(event._id, { $inc: { registrations: 1 } });
  await registration.populate('event');
  res.status(201).json({ status: 'success', data: registration });
});

export const getMyRegistrations = asyncHandler(async (req, res) => {
  const registrations = await Registration.find({ attendee: req.user.id })
    .populate('event')
    .sort({ createdAt: -1 });
  res.json({ status: 'success', data: registrations });
});

export const cancelRegistration = asyncHandler(async (req, res, next) => {
  const registration = await Registration.findById(req.params.id);
  if (!registration) return next(new AppError('Registration not found', 404));
  if (registration.attendee.toString() !== req.user.id.toString()) {
    return next(new AppError('You can only cancel your own registration', 403));
  }

  await registration.deleteOne();
  await Event.findByIdAndUpdate(registration.event, { $inc: { registrations: -1 } });
  res.json({ status: 'success', message: 'Registration cancelled successfully' });
});
