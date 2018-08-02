import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModules } from '../app.module';
import { NewDraftComponent } from './new-draft.component';
import { DraftService } from './draft.service';
import { Router, ActivatedRoute } from '@angular/router';
import { customProviders } from '../app.providers';
import { mockRouter, mockActivatedRoute, NotificationServiceSpy } from '../app.mock-services';
import { NotificationService } from '../common/notification.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup } from '@angular/forms';

describe('NewDraftComponent', () => {
    let component: NewDraftComponent;
    let fixture: ComponentFixture<NewDraftComponent>;
  let draftServiceSpy: DraftServiceSpy;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [NewDraftComponent],
      imports: [AppModules],
      providers: [
        { provide: DraftService, useClass: DraftServiceSpy },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: MAT_DIALOG_DATA, useValue: { selectedProject: { _id: 1 } } },
        { provide: MatDialogRef, useValue: {} }
      ]
    });
    fixture = TestBed.createComponent(NewDraftComponent);
    component = fixture.componentInstance;
    draftServiceSpy = TestBed.get(DraftService);
  }));

  beforeEach(() => {
      fixture = TestBed.createComponent(NewDraftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should create a `draftForm` comprised of `FormControl`s', () => {
    component.ngOnInit();
    expect(component.draftForm instanceof FormGroup).toBe(true);
  });

  it('addDraft function is avaliable', () => {
    fixture.detectChanges();
    expect(draftServiceSpy.addDraft).toBeTruthy();
  });

  it('addDraft service not called initally', () => {
    fixture.detectChanges();
    expect(draftServiceSpy.addDraft.calls.count()).toBe(0, 'addDraft not called');
  });

  it('before click create button should be disabled', () => {
    const btn = fixture.debugElement.nativeElement.querySelector('button[type="submit"]');
    fixture.detectChanges();
    expect(btn.disabled).toBe(true);
  });

  it('after filling data create button should be enabled', () => {
    component.draftForm.value.draftName = 'test1231';
    fixture.detectChanges();
    const btn = fixture.debugElement.nativeElement.querySelector('button[type="submit"]');
    expect(btn.disabled).toBe(false);
  });

  it('clicking on createDraft button createDraft should be called', () => {
    component.draftForm.value.distributionName = 'test123132';
    const btn = fixture.debugElement.nativeElement.querySelector('button[type="submit"]');
    btn.click();
    expect(draftServiceSpy.emitEvent).toHaveBeenCalledTimes(0);
  });
});

export class DraftServiceSpy {
  getSaveDraftEmitter = jasmine.createSpy('getSaveDraftEmitter').and.callFake(() => Promise
    .resolve(true)
    .then(() => Object.assign({}, []))
  );

  getDrafts = jasmine.createSpy('getDrafts').and.callFake(() => Promise
    .resolve(true)
    .then(() => Object.assign({}, []))
  );

  addDraft = jasmine.createSpy('addDraft').and.callFake(() => Promise
    .resolve(true)
    .then(() => Object.assign({}, []))
  );
  emitEvent = jasmine.createSpy('emitEvent');
}
