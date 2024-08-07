import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { FileUploadController } from "./controller";
import { FileUploadService } from "../services/file-upload-service";
import { FileUploadMiddleware } from "../middlewares/file-upload.middleware";

export class FileUploadRoutes {

    public static get routes(): Router {

        const router = Router();

        const fileUploadController = new FileUploadController(
            new FileUploadService
        );

        //use the middleware here because it should run for both request below
        //it's just another way to run the middleware
        router.use([
            FileUploadMiddleware.containFiles,
            FileUploadMiddleware.checkValidTypes(['users', 'products', 'categories'])
        ]);

        //  api/upload/
        router.post('/single/:type', [ AuthMiddleware.validateJWT ], fileUploadController.uploadFile);
        router.post('/multiple/:type', [ AuthMiddleware.validateJWT ], fileUploadController.uploadMultipleFiles);

        return router;
    }
}