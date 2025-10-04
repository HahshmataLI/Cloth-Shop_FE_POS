import { TestBed } from '@angular/core/testing';

import { PdfServiceTs } from './pdf.service.ts';

describe('PdfServiceTs', () => {
  let service: PdfServiceTs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdfServiceTs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
