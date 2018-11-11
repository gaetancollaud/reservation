import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IResource } from 'app/shared/model/resource.model';
import { Principal } from 'app/core';
import { ResourceService } from './resource.service';

@Component({
    selector: 'jhi-resource',
    templateUrl: './resource.component.html'
})
export class ResourceComponent implements OnInit, OnDestroy {
    resources: IResource[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private resourceService: ResourceService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {}

    loadAll() {
        this.resourceService.query().subscribe(
            (res: HttpResponse<IResource[]>) => {
                this.resources = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    ngOnInit() {
        this.loadAll();
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInResources();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IResource) {
        return item.id;
    }

    registerChangeInResources() {
        this.eventSubscriber = this.eventManager.subscribe('resourceListModification', response => this.loadAll());
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
