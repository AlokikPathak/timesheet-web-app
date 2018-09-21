
import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NavDashboardComponent } from './nav-dashboard.component';

describe('NavDashboardComponent', () => {
  let component: NavDashboardComponent;
  let fixture: ComponentFixture<NavDashboardComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [MatSidenavModule],
      declarations: [NavDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
