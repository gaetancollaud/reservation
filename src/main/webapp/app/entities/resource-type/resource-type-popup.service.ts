import {Injectable, Component} from '@angular/core';
import {Router} from '@angular/router';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {HttpResponse} from '@angular/common/http';
import {ResourceType} from './resource-type.model';
import {ResourceTypeService} from './resource-type.service';

@Injectable()
export class ResourceTypePopupService {
	private ngbModalRef: NgbModalRef;

	constructor(
		private modalService: NgbModal,
		private router: Router,
		private resourceTypeService: ResourceTypeService
	) {
		this.ngbModalRef = null;
	}

	open(component: Component, id?: number | any): Promise<NgbModalRef> {
		return new Promise<NgbModalRef>((resolve, reject) => {
			const isOpen = this.ngbModalRef !== null;
			if (isOpen) {
				resolve(this.ngbModalRef);
			}

			if (id) {
				this.resourceTypeService.find(id)
					.subscribe((resourceTypeResponse: HttpResponse<ResourceType>) => {
						const resourceType: ResourceType = resourceTypeResponse.body;
						this.ngbModalRef = this.resourceTypeModalRef(component, resourceType);
						resolve(this.ngbModalRef);
					});
			} else {
				// setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
				setTimeout(() => {
					this.ngbModalRef = this.resourceTypeModalRef(component, new ResourceType());
					resolve(this.ngbModalRef);
				}, 0);
			}
		});
	}

	resourceTypeModalRef(component: Component, resourceType: ResourceType): NgbModalRef {
		const modalRef = this.modalService.open(component, {size: 'lg', backdrop: 'static'});
		modalRef.componentInstance.resourceType = resourceType;
		modalRef.result.then((result) => {
			this.router.navigate([{outlets: {popup: null}}], {replaceUrl: true, queryParamsHandling: 'merge'});
			this.ngbModalRef = null;
		}, (reason) => {
			this.router.navigate([{outlets: {popup: null}}], {replaceUrl: true, queryParamsHandling: 'merge'});
			this.ngbModalRef = null;
		});
		return modalRef;
	}
}
