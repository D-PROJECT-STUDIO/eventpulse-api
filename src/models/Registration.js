import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
  attendee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true }
}, { timestamps: true });
registrationSchema.index({ attendee: 1, event: 1 }, { unique: true });
export default mongoose.model('Registration', registrationSchema);
