/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { ReservationTestModule } from '../../../test.module';
import { ResourceTypeUpdateComponent } from 'app/entities/resource-type/resource-type-update.component';
import { ResourceTypeService } from 'app/entities/resource-type/resource-type.service';
import { ResourceType } from 'app/shared/model/resource-type.model';

describe('Component Tests', () => {
    describe('ResourceType Management Update Component', () => {
        let comp: ResourceTypeUpdateComponent;
        let fixture: ComponentFixture<ResourceTypeUpdateComponent>;
        let service: ResourceTypeService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ReservationTestModule],
                declarations: [ResourceTypeUpdateComponent]
            })
                .overrideTemplate(ResourceTypeUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(ResourceTypeUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ResourceTypeService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new ResourceType(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.resourceType = entity;
                    // WHEN
                    comp.save();
                    tick(); // simulate async

                    // THEN
                    expect(service.update).toHaveBeenCalledWith(entity);
                    expect(comp.isSaving).toEqual(false);
                })
            );

            it(
                'Should call create service on save for new entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new ResourceType();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.resourceType = entity;
                    // WHEN
                    comp.save();
                    tick(); // simulate async

                    // THEN
                    expect(service.create).toHaveBeenCalledWith(entity);
                    expect(comp.isSaving).toEqual(false);
                })
            );
        });
    });
});
