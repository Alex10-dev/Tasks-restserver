interface JsonData {
    [key: string]: any
}

export class UpdateTaskDTO {

    public readonly title?: string | null;
    public readonly isCompleted?: boolean | null;
    public readonly description?: string | null;
    public readonly completedAt?: Date | null;

    constructor( data: JsonData ){
        this.title = data.title;
        this.isCompleted = data.isCompleted;
        this.description = data.description;
        this.completedAt = data.completedAt;
    }

    public static create( data: JsonData ): [string?, UpdateTaskDTO?]{

        const { title, isCompleted, description, completedAt } = data;
        let newCompletedAt = null;

        if( title ){
            if( typeof title !== 'string' ) return ['title must be a string'];
            if( title.length <= 3 ) return['title is too short'];
        }

        if( isCompleted != null && typeof isCompleted !== 'boolean') return ['isCompleted must be a boolean'];
        if( isCompleted ) {
            if( !completedAt ) return ['completedAt is required because completed is true'];
            newCompletedAt = new Date( completedAt );
            if( newCompletedAt.toString() === 'Invalid Date' ) return ['CompletedAt must be a valid date'];
        }

        if( description && typeof description !== 'string' ) return ['description must be a string'];
        
        return [undefined, new UpdateTaskDTO({
            title: title,
            isCompleted: isCompleted,
            description: description,
            completedAt: newCompletedAt
        })]
        
    };

    public getDataToUpdate( ){
        return Object.fromEntries(
            Object.entries( this ).filter( ([_, value]) => value !== null && value !== undefined )
        );
    };
}