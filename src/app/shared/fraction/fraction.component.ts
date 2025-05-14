import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-fraction',
  templateUrl: './fraction.component.html',
  styleUrls: ['./fraction.component.css']
})
export class FractionComponent {
  @Input() numerator!: string;
  @Input() denominator!: string;
}
