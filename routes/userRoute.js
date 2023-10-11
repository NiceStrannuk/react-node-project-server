import userController from "../controllers/userController.js"
import { Router } from "express";
import requireAuth from "../middlewares/authMiddleware.js";

const router = new Router();

router.post("/user/registration", userController.registration);
router.post("/user/login", userController.login);
router.post("/user/logout", requireAuth, userController.logout);
router.get("/user/:id", requireAuth, userController.getUserById);

export default router;