import { Router } from "express";
import { AuthControllers } from "./auth.controllers";

const router = Router();

router.post("/login", AuthControllers.credentialLogin);
router.post("/refresh-token", AuthControllers.getNewAccessToken);

export const AuthRoute = router;
