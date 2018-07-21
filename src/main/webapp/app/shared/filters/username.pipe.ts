import {Pipe, PipeTransform} from '@angular/core';
import {User} from '..';

@Pipe({
	name: 'username'
})
export class UsernamePipe implements PipeTransform {

	transform(user: User): any {
		return user ? `${user.firstName} ${user.lastName[0]}.` : '';
	}

}
