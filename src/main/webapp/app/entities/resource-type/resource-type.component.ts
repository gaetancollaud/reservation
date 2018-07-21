import {Component, OnInit, OnDestroy} from '@angular/core';
import {HttpResponse, HttpErrorResponse} from '@angular/common/http';
import {Subscription} from 'rxjs/Subscription';
import {JhiEventManager, JhiAlertService} from 'ng-jhipster';

import {ResourceType} from './resource-type.model';
import {ResourceTypeService} from './resource-type.service';
import {Principal} from '../../shared';

@Component({
	selector: 'jhi-resource-type',
	templateUrl: './resource-type.component.html'
})
export class ResourceTypeComponent implements OnInit, OnDestroy {
	resourceTypes: ResourceType[];
	currentAccount: any;
	eventSubscriber: Subscription;

	constructor(
		private resourceTypeService: ResourceTypeService,
		private jhiAlertService: JhiAlertService,
		private eventManager: JhiEventManager,
		private principal: Principal
	) {
	}

	loadAll() {
		this.resourceTypeService.query().subscribe(
			(res: HttpResponse<ResourceType[]>) => {
				this.resourceTypes = res.body;
			},
			(res: HttpErrorResponse) => this.onError(res.message)
		);
	}

	ngOnInit() {
		this.loadAll();
		this.principal.identity().then((account) => {
			this.currentAccount = account;
		});
		this.registerChangeInResourceTypes();
	}

	ngOnDestroy() {
		this.eventManager.destroy(this.eventSubscriber);
	}

	trackId(index: number, item: ResourceType) {
		return item.id;
	}

	registerChangeInResourceTypes() {
		this.eventSubscriber = this.eventManager.subscribe('resourceTypeListModification', (response) => this.loadAll());
	}

	private onError(error) {
		this.jhiAlertService.error(error.message, null, null);
	}
}
