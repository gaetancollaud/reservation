import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IResourceType } from 'app/shared/model/resource-type.model';

@Component({
    selector: 'jhi-resource-type-detail',
    templateUrl: './resource-type-detail.component.html'
})
export class ResourceTypeDetailComponent implements OnInit {
    resourceType: IResourceType;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ resourceType }) => {
            this.resourceType = resourceType;
        });
    }

    previousState() {
        window.history.back();
    }
}
