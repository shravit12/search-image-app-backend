import mongoose from "mongoose";

const SearchSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  term: { type: String, index: true },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("Search", SearchSchema);
