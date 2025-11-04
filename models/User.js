import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  provider: String,
  providerId: String,
  avatar: String,
}, { timestamps: true });

export default mongoose.model("User", UserSchema);
