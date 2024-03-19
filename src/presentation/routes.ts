import { Router } from "express";
import { TaskRoutes } from "./tasks/routes";
import { UserRoutes } from "./users/routes";
import { AuthRoutes } from "./auth/routes";
import { TodoRoutes } from "./todos/routes";


export class AppRoutes {

    public static get routes(): Router {

        const router = Router();

        router.use('/api/tasks', TaskRoutes.routes);
        router.use('/api/users', UserRoutes.routes);
        router.use('/api/auth', AuthRoutes.routes);
        router.use('/api/todos', TodoRoutes.routes);

        return router;
    }
}