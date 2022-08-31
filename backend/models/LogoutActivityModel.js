import mongoose from 'mongoose';

const logoutActivitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const LogoutActivity = mongoose.model('logout_activity', logoutActivitySchema);
export default LogoutActivity;
