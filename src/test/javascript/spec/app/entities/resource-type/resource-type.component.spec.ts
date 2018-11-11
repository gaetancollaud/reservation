/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { ReservationTestModule } from '../../../test.module';
import { ResourceTypeComponent } from 'app/entities/resource-type/resource-type.component';
import { ResourceTypeService } from 'app/entities/resource-type/resource-type.service';
import { ResourceType } from 'app/shared/model/resource-type.model';

describe('Component Tests', () => {
    describe('ResourceType Management Component', () => {
        let comp: ResourceTypeComponent;
        let fixture: ComponentFixture<ResourceTypeComponent>;
        let service: ResourceTypeService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ReservationTestModule],
                declarations: [ResourceTypeComponent],
                providers: []
            })
                .overrideTemplate(ResourceTypeComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(ResourceTypeComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ResourceTypeService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new ResourceType(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.resourceTypes[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
