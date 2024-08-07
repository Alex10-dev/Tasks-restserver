import path from 'path';
import fs from 'fs';

import { UploadedFile } from "express-fileupload";
import { UUID } from '../../config/uuid.adapter';
import { CustomError } from '../../domain/errors/custom.error';

export class FileUploadService {

    constructor(
        private readonly uuid = UUID.v4,
    ){}

    private checkFolderExist( folderPath: string ){
        if( !fs.existsSync(folderPath) ){
            fs.mkdirSync( folderPath );
        }
    }

    async uploadSingleFile(
        file: UploadedFile,
        folder: string = 'uploads',
        validExtensions: string[] = ['png', 'jpg', 'jpeg', 'gif']
    ) {
        try {
            const fileExtension = file.mimetype.split('/').at(1) ?? '';

            if( !validExtensions.includes(fileExtension) ){
                throw CustomError.badRequest(`Invalid extension: ${ fileExtension }, valid ones: ${ validExtensions }`);
            }

            const destination = path.resolve( __dirname, '../../../', folder );
            this.checkFolderExist( destination );

            const newFileName = `${ this.uuid() }.${ fileExtension }`;

            file.mv(`${destination}/${newFileName}`);

            return { fileName: newFileName };

        } catch( error ){
            console.log({error});
            throw error;
        }
    }

    async uploadMultipleFiles(
        files: UploadedFile[],
        folder: string = 'uploads',
        validExtensions: string[] = ['png', 'jpg', 'jpeg', 'gif']
    ){
        const fileNames = await Promise.all(
            files.map( file => this.uploadSingleFile( file, folder, validExtensions ) )
        );

        return fileNames;
    }
}