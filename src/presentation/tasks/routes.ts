import { Router } from "express";
import { TaskController } from "./controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { TaskService } from "../services/task.service";

export class TaskRoutes {

    public static get routes(): Router {

        const router = Router();

        const taskService = new TaskService()
        const taskController = new TaskController( taskService );

        router.get('/', [ AuthMiddleware.validateJWT ], taskController.getTasks);
        router.post('/', [ AuthMiddleware.validateJWT ], taskController.createTasks);

        return router;
    }
}