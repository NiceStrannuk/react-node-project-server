import { Schema, model } from "mongoose";
import validator from 'validator'
import bcrypt from "bcrypt"

const UserSchema = new Schema({
	username: { type: String, require: [true, "Username is require"], minLength: [2, "Your username must be more than 2 characters long"], maxLength: [30, "Your username must be less than 30 characters long"] },
	email: { type: String, require: [true, "Please enter a email"], unique: true, validate: [validator.isEmail, "Please enter a valid email"] },
	password: { type: String, require: [true, "Please enter a password"], minLength: [6, "Your password must be more than 6 characters long"] }
})

UserSchema.pre("save", async function (next) {
	try {
		if (this.isNew) {
			const saltRounds = 5;
			const salt = await bcrypt.genSalt(saltRounds);
			this.password = await bcrypt.hash(this.password, salt);
		}
		next()
	} catch (error) {
		next()
	}
});

UserSchema.statics.login = async function (password, email) {
	const user = await this.findOne({ email });
	if (user) {
		const isPassEuqual = await bcrypt.compare(password, user.password);
		if (isPassEuqual) {
			return user;
		}
		throw Error("incorrect password")
	}
	throw Error("incorrect email")
}

export default model("user", UserSchema)