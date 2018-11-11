import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IResourceType } from 'app/shared/model/resource-type.model';
import { Principal } from 'app/core';
import { ResourceTypeService } from './resource-type.service';

@Component({
    selector: 'jhi-resource-type',
    templateUrl: './resource-type.component.html'
})
export class ResourceTypeComponent implements OnInit, OnDestroy {
    resourceTypes: IResourceType[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private resourceTypeService: ResourceTypeService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {}

    loadAll() {
        this.resourceTypeService.query().subscribe(
            (res: HttpResponse<IResourceType[]>) => {
                this.resourceTypes = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    ngOnInit() {
        this.loadAll();
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInResourceTypes();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IResourceType) {
        return item.id;
    }

    registerChangeInResourceTypes() {
        this.eventSubscriber = this.eventManager.subscribe('resourceTypeListModification', response => this.loadAll());
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
