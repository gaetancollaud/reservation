/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { ReservationTestModule } from '../../../test.module';
import { ResourceComponent } from '../../../../../../main/webapp/app/entities/resource/resource.component';
import { ResourceService } from '../../../../../../main/webapp/app/entities/resource/resource.service';
import { Resource } from '../../../../../../main/webapp/app/entities/resource/resource.model';

describe('Component Tests', () => {

    describe('Resource Management Component', () => {
        let comp: ResourceComponent;
        let fixture: ComponentFixture<ResourceComponent>;
        let service: ResourceService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [ReservationTestModule],
                declarations: [ResourceComponent],
                providers: [
                    ResourceService
                ]
            })
            .overrideTemplate(ResourceComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ResourceComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ResourceService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new Resource(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.resources[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
