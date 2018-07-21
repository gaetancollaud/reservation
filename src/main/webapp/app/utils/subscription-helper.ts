import {AnonymousSubscription} from 'rxjs/Subscription';

export class SubscriptionHelper {

	private subscriptions: AnonymousSubscription[];

	constructor() {
		this.subscriptions = [];
	}

	public addSubscription(subscription: AnonymousSubscription): AnonymousSubscription {
		this.subscriptions.push(subscription);
		return subscription;
	}

	public unsubscribeAll(): void {
		this.subscriptions.forEach((s: AnonymousSubscription) => {
			s.unsubscribe();
		});
	}
}
