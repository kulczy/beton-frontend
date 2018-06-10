import { Component, Input } from '@angular/core';
import { inOut } from '../../utils/animation';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  animations: [inOut]
})
export class HeaderComponent {
  @Input() title: string;
  @Input() back = false;
  @Input() container = true;

  constructor() { }

}
