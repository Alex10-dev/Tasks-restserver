import { Router } from "express";
import { TaskController } from "./controller";

export class TaskRoutes {

    public static get routes(): Router {

        const router = Router();
        const taskController = new TaskController();

        router.get('/', taskController.getTasks);

        return router;
    }
}