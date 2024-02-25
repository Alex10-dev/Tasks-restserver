import { Router } from "express";
import { UserController } from "./controller";

export class UserRoutes {

    public static get routes(): Router {

        const router = Router();
        const userController = new UserController();

        router.get('/', userController.getUsers);

        return router;
    }
}