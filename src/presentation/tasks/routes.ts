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
        router.put('/update/:id', [ AuthMiddleware.validateJWT ], taskController.updateTask);
        router.put('/assign-user/:id', [ AuthMiddleware.validateJWT ], taskController.assignUserToTask);
        router.put('/unassign-user/:id', [ AuthMiddleware.validateJWT ], taskController.unassignUserFromTask);

        router.delete('/:id', [ AuthMiddleware.validateJWT ], taskController.deleteTask);
        return router;
    }
}