/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { ReservationTestModule } from '../../../test.module';
import { ResourceTypeDetailComponent } from '../../../../../../main/webapp/app/entities/resource-type/resource-type-detail.component';
import { ResourceTypeService } from '../../../../../../main/webapp/app/entities/resource-type/resource-type.service';
import { ResourceType } from '../../../../../../main/webapp/app/entities/resource-type/resource-type.model';

describe('Component Tests', () => {

    describe('ResourceType Management Detail Component', () => {
        let comp: ResourceTypeDetailComponent;
        let fixture: ComponentFixture<ResourceTypeDetailComponent>;
        let service: ResourceTypeService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [ReservationTestModule],
                declarations: [ResourceTypeDetailComponent],
                providers: [
                    ResourceTypeService
                ]
            })
            .overrideTemplate(ResourceTypeDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ResourceTypeDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ResourceTypeService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new ResourceType(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.resourceType).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
