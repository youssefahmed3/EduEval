import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddQuestionToExamComponent } from './add-question-to-exam.component';

describe('AddQuestionToExamComponent', () => {
  let component: AddQuestionToExamComponent;
  let fixture: ComponentFixture<AddQuestionToExamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddQuestionToExamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddQuestionToExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
