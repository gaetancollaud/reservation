import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ResourceType } from './resource-type.model';
import { ResourceTypePopupService } from './resource-type-popup.service';
import { ResourceTypeService } from './resource-type.service';

@Component({
    selector: 'jhi-resource-type-delete-dialog',
    templateUrl: './resource-type-delete-dialog.component.html'
})
export class ResourceTypeDeleteDialogComponent {

    resourceType: ResourceType;

    constructor(
        private resourceTypeService: ResourceTypeService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.resourceTypeService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'resourceTypeListModification',
                content: 'Deleted an resourceType'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-resource-type-delete-popup',
    template: ''
})
export class ResourceTypeDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private resourceTypePopupService: ResourceTypePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.resourceTypePopupService
                .open(ResourceTypeDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
