import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Coquille racine de /dashboard : ne fait que déléguer aux layouts
 * client/admin définis dans dashboard-routing.ts (chacun a sa propre
 * sidebar via DashboardShellComponent).
 */
@Component({
  selector: 'app-dasboard-layout',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './dasboard-layout.component.html',
  styleUrl: './dasboard-layout.component.scss'
})
export class DasboardLayoutComponent {

}
