import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPurchase } from './list-purchase';

describe('ListPurchase', () => {
  let component: ListPurchase;
  let fixture: ComponentFixture<ListPurchase>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListPurchase]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListPurchase);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
