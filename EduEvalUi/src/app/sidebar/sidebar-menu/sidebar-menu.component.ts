import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-sidebar-menu',
  imports: [],
  templateUrl: './sidebar-menu.component.html',
  styleUrl: './sidebar-menu.component.scss'
})
export class SidebarMenuComponent {
  @Input({required: true}) menuTitle!: string;
}
