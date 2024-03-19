interface JsonData {
    [key: string]: any
}

export class UpdateTodoDTO {

    public readonly isCompleted?: boolean | null;
    public readonly description?: string | null;
    public readonly completedAt?: Date | null;

    constructor( data: JsonData ){
        this.isCompleted = data.isCompleted;
        this.description = data.description;
        this.completedAt = data.completedAt;
    }

    public static create( data: JsonData ): [string?, UpdateTodoDTO?]{

        const { isCompleted, description, completedAt } = data;
        let newCompletedAt = null;

        if( isCompleted != null && typeof isCompleted !== 'boolean') return ['isCompleted must be a boolean'];
        if( isCompleted ) {
            if( !completedAt ) return ['completedAt is required because completed is true'];
            newCompletedAt = new Date( completedAt );
            if( newCompletedAt.toString() === 'Invalid Date' ) return ['CompletedAt must be a valid date'];
        }

        if( description && typeof description !== 'string' ) return ['description must be a string'];
        
        return [undefined, new UpdateTodoDTO({
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