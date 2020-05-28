import { Component, OnInit, Input } from '@angular/core';

import { Species } from '../species';
import { Color } from '../color';

@Component({
  selector: 'app-flower-icon',
  templateUrl: './flower-icon.component.html',
  styleUrls: ['./flower-icon.component.css']
})
export class FlowerIconComponent implements OnInit {

  @Input() species: Species;
  @Input() color: Color;

  // Should be one of: "large", "medium", "small", "tiny"
  @Input() size: string = "large";

  constructor() { }

  ngOnInit(): void {
  }

}
