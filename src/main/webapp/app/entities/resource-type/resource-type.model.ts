import {BaseEntity} from './../../shared';

export class ResourceType implements BaseEntity {
	constructor(
		public id?: number,
		public name?: string,
		public minTimeSec?: number,
		public maxTimeSec?: number,
		public maxResource?: number,
	) {
	}
}
