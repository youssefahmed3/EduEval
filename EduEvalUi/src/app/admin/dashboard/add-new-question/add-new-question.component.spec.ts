import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewQuestionComponent } from './add-new-question.component';

describe('AddNewQuestionComponent', () => {
  let component: AddNewQuestionComponent;
  let fixture: ComponentFixture<AddNewQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewQuestionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNewQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
