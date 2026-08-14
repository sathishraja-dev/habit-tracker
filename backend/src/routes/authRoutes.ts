import { Router } from "express";
import { signupController } from "../controllers/authController.js";

const router = Router();

/**
 * Registers a new user account.
 *
 * The route delegates request handling to the authentication controller,
 * keeping route definitions focused on mapping HTTP methods and URLs to
 * their corresponding controllers.
 */
router.post("/signup", signupController);

export default router;
