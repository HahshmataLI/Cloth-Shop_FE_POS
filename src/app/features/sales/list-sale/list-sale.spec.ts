import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSale } from './list-sale';

describe('ListSale', () => {
  let component: ListSale;
  let fixture: ComponentFixture<ListSale>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListSale]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListSale);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
