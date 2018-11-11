import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IResourceType } from 'app/shared/model/resource-type.model';
import { ResourceTypeService } from './resource-type.service';

@Component({
    selector: 'jhi-resource-type-delete-dialog',
    templateUrl: './resource-type-delete-dialog.component.html'
})
export class ResourceTypeDeleteDialogComponent {
    resourceType: IResourceType;

    constructor(
        private resourceTypeService: ResourceTypeService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.resourceTypeService.delete(id).subscribe(response => {
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
    private ngbModalRef: NgbModalRef;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ resourceType }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(ResourceTypeDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.resourceType = resourceType;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate([{ outlets: { popup: null } }], { replaceUrl: true, queryParamsHandling: 'merge' });
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate([{ outlets: { popup: null } }], { replaceUrl: true, queryParamsHandling: 'merge' });
                        this.ngbModalRef = null;
                    }
                );
            }, 0);
        });
    }

    ngOnDestroy() {
        this.ngbModalRef = null;
    }
}
