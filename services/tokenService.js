import jwt from "jsonwebtoken";

const maxAge = 60 * 60 * 24 * 3;

class tokenService {

	maxAge

	constructor(maxAge) {
		this.maxAge = maxAge;
	}

	async createToken(id) {
		try {
			const token = jwt.sign({ id }, process.env.SECRET_KEY,
				{ expiresIn: this.maxAge }
			)
			return { token, maxAge };
		} catch (error) {
			throw new Error(error)
		}
	}
}

export default new tokenService(maxAge)