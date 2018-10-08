import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { Resource } from './resource.model';
import { ResourceService } from './resource.service';

@Component({
    selector: 'jhi-resource-detail',
    templateUrl: './resource-detail.component.html'
})
export class ResourceDetailComponent implements OnInit, OnDestroy {

    resource: Resource;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private resourceService: ResourceService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInResources();
    }

    load(id) {
        this.resourceService.find(id)
            .subscribe((resourceResponse: HttpResponse<Resource>) => {
                this.resource = resourceResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInResources() {
        this.eventSubscriber = this.eventManager.subscribe(
            'resourceListModification',
            (response) => this.load(this.resource.id)
        );
    }
}
