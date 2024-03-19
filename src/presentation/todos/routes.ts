import { Router } from "express";
import { TodoService } from "../services/todo.service";
import { TodoController } from "./controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";

export class TodoRoutes {
    public static get routes(): Router {

        const router = Router();

        const todoService = new TodoService();
        const todoController= new TodoController( todoService );

        router.get('/:id', [ AuthMiddleware.validateJWT ], todoController.getTodos);
        router.post('/:id', [ AuthMiddleware.validateJWT ], todoController.createTodo);
        router.put('/:id', [ AuthMiddleware.validateJWT ], todoController.updateTodo);
        router.delete('/:id', [ AuthMiddleware.validateJWT ], todoController.deleteTodo);

        return router;
    }
}