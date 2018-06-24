/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { ReservationTestModule } from '../../../test.module';
import { ResourceTypeComponent } from '../../../../../../main/webapp/app/entities/resource-type/resource-type.component';
import { ResourceTypeService } from '../../../../../../main/webapp/app/entities/resource-type/resource-type.service';
import { ResourceType } from '../../../../../../main/webapp/app/entities/resource-type/resource-type.model';

describe('Component Tests', () => {

    describe('ResourceType Management Component', () => {
        let comp: ResourceTypeComponent;
        let fixture: ComponentFixture<ResourceTypeComponent>;
        let service: ResourceTypeService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [ReservationTestModule],
                declarations: [ResourceTypeComponent],
                providers: [
                    ResourceTypeService
                ]
            })
            .overrideTemplate(ResourceTypeComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ResourceTypeComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ResourceTypeService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new ResourceType(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.resourceTypes[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
