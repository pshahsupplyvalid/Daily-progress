import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RailwayList } from './railway-list';

describe('RailwayList', () => {
  let component: RailwayList;
  let fixture: ComponentFixture<RailwayList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RailwayList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RailwayList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
