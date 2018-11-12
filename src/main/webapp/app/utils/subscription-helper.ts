import { SubscriptionLike } from 'rxjs';

export class SubscriptionHelper {
    private subscriptions: SubscriptionLike[];

    constructor() {
        this.subscriptions = [];
    }

    public addSubscription(subscription: SubscriptionLike): SubscriptionLike {
        this.subscriptions.push(subscription);
        return subscription;
    }

    public unsubscribeAll(): void {
        this.subscriptions.forEach((s: SubscriptionLike) => {
            s.unsubscribe();
        });
    }
}
