import express, { Router } from 'express';
import fileUpload from 'express-fileupload';

interface ServerOptions {
    port: number,
    public_path: string,
    routes: Router,
};


export class Server {

    private readonly port: number;
    private readonly public_path: string;
    private readonly routes: Router;
    private app = express();

    constructor( options: ServerOptions ){
        const { port, public_path = 'public', routes } = options;
        this.port = port;
        this.public_path = public_path;
        this.routes = routes;
    };

    async startServer(){

        //Middlewares
        this.app.use( express.json() );
        this.app.use(fileUpload({
            limits: { fileSize: 50 * 1024 * 1024 },
        }));

        //Routes
        this.app.use( this.routes );
        
        this.app.listen(3000, () => {
            console.log(`Server running on port: ${ this.port }`);
        })
    }
}