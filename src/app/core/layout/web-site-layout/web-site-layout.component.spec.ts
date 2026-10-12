import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebSiteLayoutComponent } from './web-site-layout.component';

describe('WebSiteLayoutComponent', () => {
  let component: WebSiteLayoutComponent;
  let fixture: ComponentFixture<WebSiteLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebSiteLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebSiteLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
