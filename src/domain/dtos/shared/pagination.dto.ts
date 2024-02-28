
export class PaginationDTO {


    private constructor(
        public readonly page: number,
        public readonly limit: number,
    ){};

    public static create( page: number = 1, limit: number = 10 ): [string?, PaginationDTO?] {

        if( isNaN(page) || isNaN(limit) ) return ['Page and number must be a number'];
        if( page <= 0 ) return ['Page must be greater than 0'];
        if( limit <= 0 ) return ['Limit must be greater than 0'];

        return [ undefined, new PaginationDTO(page, limit)];
    }
}