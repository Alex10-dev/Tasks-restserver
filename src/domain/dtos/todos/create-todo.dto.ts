interface JsonData {
    [key: string]: any
}

export class CreateTodoDTO {

    public readonly description: string;
    public readonly isCompleted: boolean;
    public readonly completedAt?: Date | null;

    constructor( data: JsonData ){
        this.description = data.description;
        this.isCompleted = data.isCompleted;
        this.completedAt = data.completedAt
    }

    static create( data: JsonData ): [string?, CreateTodoDTO?]{

        const { description, completedAt } = data;
        let { isCompleted } = data;

        if( !description ) return ['the description is required'];
        if( description && typeof description !== 'string' ) return ['description must be a string'];
        if( isCompleted == null ) isCompleted = false;
        if( typeof isCompleted !== 'boolean' ) return ['isCompleted must be boolean'];
        
        let newCompletedAt = null;
        if( isCompleted == true ){
            if( completedAt ){
                newCompletedAt = new Date( completedAt );
                if( newCompletedAt.toString() === 'Invalid Date' ) return ['CompletedAt must be a valid date'];
                isCompleted = true;
            };
        }

        return [undefined, new CreateTodoDTO({
            description: description,
            isCompleted: isCompleted,
            completedAt: newCompletedAt,
        })]
        
    }
}