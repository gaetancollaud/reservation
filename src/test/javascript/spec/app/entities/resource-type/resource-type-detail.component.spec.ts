/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ReservationTestModule } from '../../../test.module';
import { ResourceTypeDetailComponent } from 'app/entities/resource-type/resource-type-detail.component';
import { ResourceType } from 'app/shared/model/resource-type.model';

describe('Component Tests', () => {
    describe('ResourceType Management Detail Component', () => {
        let comp: ResourceTypeDetailComponent;
        let fixture: ComponentFixture<ResourceTypeDetailComponent>;
        const route = ({ data: of({ resourceType: new ResourceType(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ReservationTestModule],
                declarations: [ResourceTypeDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(ResourceTypeDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(ResourceTypeDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.resourceType).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
