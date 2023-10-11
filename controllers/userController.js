import userModel from "../models/userModel.js";
import tokenService from "../services/tokenService.js"

const handleErrors = (err) => {
	const errors = { useername: "", email: "", password: "" };
	if (err.message.includes("user validation faile")) {
		Object.values(err.errors).forEach(({ properties }) => {
			errors[properties.path] = properties.message;
		});
	};
	if (err.message === "incorrect email") {
		errors.email = "that email is not registered"
	}
	if (err.message === "incorrext password") {
		errors.password = "that password is incorrect"
	}
	if (err.code === 11000) {
		return { status: 401, message: "User with such email already exist" }
	}
	return errors;
};

class UserController {

	async registration(req, res) {
		try {
			const { username, email, password } = req.body;
			const user = await userModel.create({ username, email, password });
			const token = await tokenService.createToken(user._id);
			res.cookie("jwt", token.token, { httpOnly: true, maxAge: token.maxAge * 1000 })
			return res.json(user._id);
		} catch (error) {
			const errors = handleErrors(error)
			res.status(401).json({ errors })
		}
	}

	async login(req, res) {
		try {
			const { email, password } = req.body;
			const user = await userModel.login(password, email);

			const token = await tokenService.createToken(user._id);
			res.cookie("jwt", token.token, { httpOnly: true, maxAge: token.maxAge * 1000 })

			res.status(200).json(user._id)
		} catch (error) {
			console.log(error)
			const errors = handleErrors(error)
			res.status(401).json({ errors })
		}
	}

	async logout(req, res) {
		try {
			res.cookie("jwt", "", { maxAge: 1 })
			res.status(200).json({ message: "Logout successful" });
		} catch (error) {
			res.status(500).json({ error: error.message })
		}
	}

	async getUserById(req, res) {
		try {
			const userId = req.params.id;
			const user = await userModel.findById(userId);
			res.json(user)
		} catch (error) {
			res.status(500).json({ error: error.message })
		}
	}

}

export default new UserController();