
export class DeleteTodoDTO {

    public readonly id: number;


    private constructor( id: number ){
        this.id = id;
    };

    public static create( id: number ): [string?, DeleteTodoDTO?] {

        if( isNaN(id) ) return ['The id task must be a number'];
        if( id <= 0 ) return ['The id task must be greater than 0'];

        return [ undefined, new DeleteTodoDTO(id)];
    }
}