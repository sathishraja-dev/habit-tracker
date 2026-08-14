import { Router } from "express";
import {
  signupController,
  loginController,
} from "../controllers/authController.js";
import { validateBody } from "../middleware/validate.js";
import { signupSchema } from "../validators/authValidator.js";
import { loginSchema } from "../validators/authLoginValidator.js";

const router = Router();

/**
 * Registers a new user account.
 *
 * The route delegates request handling to the authentication controller,
 * keeping route definitions focused on mapping HTTP methods and URLs to
 * their corresponding controllers.
 */
router.post("/signup", validateBody(signupSchema), signupController);

router.post("/login", validateBody(loginSchema), loginController);

export default router;
