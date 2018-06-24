import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ResourceType } from './resource-type.model';
import { ResourceTypePopupService } from './resource-type-popup.service';
import { ResourceTypeService } from './resource-type.service';

@Component({
    selector: 'jhi-resource-type-dialog',
    templateUrl: './resource-type-dialog.component.html'
})
export class ResourceTypeDialogComponent implements OnInit {

    resourceType: ResourceType;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private resourceTypeService: ResourceTypeService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.resourceType.id !== undefined) {
            this.subscribeToSaveResponse(
                this.resourceTypeService.update(this.resourceType));
        } else {
            this.subscribeToSaveResponse(
                this.resourceTypeService.create(this.resourceType));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<ResourceType>>) {
        result.subscribe((res: HttpResponse<ResourceType>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: ResourceType) {
        this.eventManager.broadcast({ name: 'resourceTypeListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }
}

@Component({
    selector: 'jhi-resource-type-popup',
    template: ''
})
export class ResourceTypePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private resourceTypePopupService: ResourceTypePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.resourceTypePopupService
                    .open(ResourceTypeDialogComponent as Component, params['id']);
            } else {
                this.resourceTypePopupService
                    .open(ResourceTypeDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
