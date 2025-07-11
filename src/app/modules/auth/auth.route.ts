import { Router } from "express";
import { AuthControllers } from "./auth.controllers";

const router = Router();

router.post("/login", AuthControllers.credentialLogin);

export const AuthRoute = router;
