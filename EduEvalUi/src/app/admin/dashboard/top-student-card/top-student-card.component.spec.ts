import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopStudentCardComponent } from './top-student-card.component';

describe('TopStudentCardComponent', () => {
  let component: TopStudentCardComponent;
  let fixture: ComponentFixture<TopStudentCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopStudentCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopStudentCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
