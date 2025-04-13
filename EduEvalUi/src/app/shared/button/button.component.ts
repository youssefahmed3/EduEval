import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-button',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  @Input() buttonText!: string;
  @Input() type?: "button" | "submit";
  @Input() routerLink?: string;
  @Input() onClick?: () => any;  // Accept the onClick function
}
