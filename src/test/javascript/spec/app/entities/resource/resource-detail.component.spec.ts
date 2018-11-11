/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { ReservationTestModule } from '../../../test.module';
import { ResourceDetailComponent } from '../../../../../../main/webapp/app/entities/resource/resource-detail.component';
import { ResourceService } from '../../../../../../main/webapp/app/entities/resource/resource.service';
import { Resource } from '../../../../../../main/webapp/app/entities/resource/resource.model';

describe('Component Tests', () => {

    describe('Resource Management Detail Component', () => {
        let comp: ResourceDetailComponent;
        let fixture: ComponentFixture<ResourceDetailComponent>;
        let service: ResourceService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [ReservationTestModule],
                declarations: [ResourceDetailComponent],
                providers: [
                    ResourceService
                ]
            })
            .overrideTemplate(ResourceDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ResourceDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ResourceService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new Resource(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.resource).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
