import { Router } from "express";
import { AuthController } from "./controller";

export class AuthRoutes {

    public static get routes(): Router {

        const router = Router();
        const authController = new AuthController();

        router.post('/', authController.registerUser);

        return router;
    }
}