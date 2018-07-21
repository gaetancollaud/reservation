import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpResponse} from '@angular/common/http';
import {Subscription} from 'rxjs/Subscription';
import {JhiEventManager} from 'ng-jhipster';

import {ResourceType} from './resource-type.model';
import {ResourceTypeService} from './resource-type.service';

@Component({
	selector: 'jhi-resource-type-detail',
	templateUrl: './resource-type-detail.component.html'
})
export class ResourceTypeDetailComponent implements OnInit, OnDestroy {

	resourceType: ResourceType;
	private subscription: Subscription;
	private eventSubscriber: Subscription;

	constructor(
		private eventManager: JhiEventManager,
		private resourceTypeService: ResourceTypeService,
		private route: ActivatedRoute
	) {
	}

	ngOnInit() {
		this.subscription = this.route.params.subscribe((params) => {
			this.load(params['id']);
		});
		this.registerChangeInResourceTypes();
	}

	load(id) {
		this.resourceTypeService.find(id)
			.subscribe((resourceTypeResponse: HttpResponse<ResourceType>) => {
				this.resourceType = resourceTypeResponse.body;
			});
	}

	previousState() {
		window.history.back();
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
		this.eventManager.destroy(this.eventSubscriber);
	}

	registerChangeInResourceTypes() {
		this.eventSubscriber = this.eventManager.subscribe(
			'resourceTypeListModification',
			(response) => this.load(this.resourceType.id)
		);
	}
}
