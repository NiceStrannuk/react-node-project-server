import jwt from "jsonwebtoken";

export default function requireAuth(req, res, next) {
	const token = req.cookies.jwt;

	if (token) {
		jwt.verify(token, process.env.SECRET_KEY, (err, decodedToken) => {
			if (err) {
				res.json({ message: err.message })
			} else {
				console.log(decodedToken);
				next();
			}
		})
	} else {
		res.status(500).json({ message: "The user is not logged in" })
	}
}