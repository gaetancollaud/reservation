/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { ReservationTestModule } from '../../../test.module';
import { ResourceDeleteDialogComponent } from 'app/entities/resource/resource-delete-dialog.component';
import { ResourceService } from 'app/entities/resource/resource.service';

describe('Component Tests', () => {
    describe('Resource Management Delete Component', () => {
        let comp: ResourceDeleteDialogComponent;
        let fixture: ComponentFixture<ResourceDeleteDialogComponent>;
        let service: ResourceService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ReservationTestModule],
                declarations: [ResourceDeleteDialogComponent]
            })
                .overrideTemplate(ResourceDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(ResourceDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ResourceService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it('Should call delete service on confirmDelete', inject(
                [],
                fakeAsync(() => {
                    // GIVEN
                    spyOn(service, 'delete').and.returnValue(of({}));

                    // WHEN
                    comp.confirmDelete(123);
                    tick();

                    // THEN
                    expect(service.delete).toHaveBeenCalledWith(123);
                    expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
                })
            ));
        });
    });
});
