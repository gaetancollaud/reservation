import { Pipe, PipeTransform } from '@angular/core';
import { User } from 'app/core';

@Pipe({
    name: 'username'
})
export class UsernamePipe implements PipeTransform {
    transform(user: User): any {
        if (user) {
            if (user.lastName) {
                return `${user.firstName} ${user.lastName[0]}.`;
            } else {
                return user.firstName;
            }
        }
        return '';
    }
}
