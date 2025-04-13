import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentExamCardComponent } from './recent-exam-card.component';

describe('RecentExamCardComponent', () => {
  let component: RecentExamCardComponent;
  let fixture: ComponentFixture<RecentExamCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentExamCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecentExamCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
