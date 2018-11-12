export interface IResource {
    id?: number;
    name?: string;
    calendarLink?: string;
    calendarSearchRegex?: string;
    typeId?: number;
}

export class Resource implements IResource {
    constructor(
        public id?: number,
        public name?: string,
        public calendarLink?: string,
        public calendarSearchRegex?: string,
        public typeId?: number
    ) {}
}
