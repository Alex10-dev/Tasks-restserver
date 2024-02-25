import { Router } from "express";
import { TaskRoutes } from "./tasks/routes";
import { UserRoutes } from "./users/routes";
import { AuthRoutes } from "./auth/routes";


export class AppRoutes {

    public static get routes(): Router {

        const router = Router();

        router.use('/api/tasks', TaskRoutes.routes);
        router.use('/api/users', UserRoutes.routes);
        router.use('/api/auth', AuthRoutes.routes);

        return router;
    }
}