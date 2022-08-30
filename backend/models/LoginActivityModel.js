import mongoose from 'mongoose';

const loginActivitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

const LoginActivity = mongoose.model('LoginActivity', loginActivitySchema);
export default LoginActivity;
