import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SiteHeaderComponent } from '../../../shared/ui/site-header/site-header.component';
import { SiteFooterComponent } from '../../../shared/ui/site-footer/site-footer.component';

@Component({
  selector: 'app-web-site-layout',
  standalone: true,
  imports: [RouterOutlet, SiteHeaderComponent, SiteFooterComponent],
  templateUrl: './web-site-layout.component.html',
  styleUrl: './web-site-layout.component.scss'
})
export class WebSiteLayoutComponent {

}
