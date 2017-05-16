const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  	username: {
      type: String,
      unique: true,
      required: true
    },
  	password: String,
    dob: Date,
    avatar: String,
  	role: {
    	type: String,
    	enum : ['user', 'power'],
    	default : 'user'
  	},
    facebook: {
      id: { type: String, unique: true, required: false, sparse: true},
      token: { type: String, required: false },
      name: {type: String }
    },
    google: {
      id: { type: String, unique: true, required: false, sparse: true },
      token: { type: String, required: false },
      name: {type: String }
    }
	}, {
  	timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
	}
);

const User = mongoose.model("User", userSchema);

module.exports = User;