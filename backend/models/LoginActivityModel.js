import mongoose from 'mongoose';

const loginActivitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    activityType: { type: String, default: 'login' },
  },
  {
    timestamps: true,
  }
);

const LoginActivity = mongoose.model('login_activity', loginActivitySchema);
export default LoginActivity;
