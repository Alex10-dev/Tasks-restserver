import { NextFunction, Request, Response } from "express"

export class FileUploadMiddleware {

    static containFiles = ( req: Request, res: Response, next: NextFunction ) => {

        if( !req.files || Object.keys( req.files ).length === 0 ) {
            return res.status(400).json({ error: 'No files were selected!' });
        }

        if( !Array.isArray( req.files.file ) ) {
            req.body.files = [req.files.file];
        } else {
            req.body.files = req.files.file;
        }

        next();
    }

    static checkValidTypes = ( validTypes: string[] ) => {

        return ( req: Request, res: Response, next: NextFunction ) => {

            const type = req.url.split('/').at(2) ?? '';
            //const type = req.params.type;
            // const validTypes = ['users', 'products', 'categories'];
            if( !validTypes.includes(type) ) {
                return res.status(400).json({ error: `Invalid type ${ type }, valid ones: ${ validTypes }`})
            }

            next();
        };
    }
}