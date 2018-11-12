export interface IResourceType {
    id?: number;
    name?: string;
    minTimeSec?: number;
    maxTimeSec?: number;
    maxResource?: number;
}

export class ResourceType implements IResourceType {
    constructor(
        public id?: number,
        public name?: string,
        public minTimeSec?: number,
        public maxTimeSec?: number,
        public maxResource?: number
    ) {}
}
