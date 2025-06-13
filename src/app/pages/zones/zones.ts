import { Component } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-zones',
  imports: [NgFor],
  templateUrl: './zones.html',
  styleUrl: './zones.css'
})
export class Zones {
zones = [
  { id: 1, name: 'Zone A', location: 'New York', radius: '10 km', deliveries: 5 },
  { id: 2, name: 'Zone B', location: 'Chicago', radius: '8 km', deliveries: 3 },
  { id: 3, name: 'Zone C', location: 'Los Angeles', radius: '12 km', deliveries: 7 },
];
}
