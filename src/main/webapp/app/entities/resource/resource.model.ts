import {BaseEntity} from './../../shared';

export class Resource implements BaseEntity {
	constructor(
		public id?: number,
		public name?: string,
		public typeId?: number,
	) {
	}
}
