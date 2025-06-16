import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { ZoneService } from '../../services/zone.service';
import { GlobalStatusService } from '../../services/global-status.service';

@Component({
  selector: 'app-zones',
  imports: [],
  templateUrl: './zones.html',
  styleUrl: './zones.css'
})
export class Zones implements OnInit {
  zones: Array<{ id: number, name: string, location: {lat: string, lng: string}, radius: number, deliveries: number[]}> = [];

  constructor(private zoneService: ZoneService, private globalStatusService: GlobalStatusService) {}

  ngOnInit(): void {
      this.initialization()
  }

  async initialization(): Promise<void> {
    this.globalStatusService.setLoading(true);
    const data = await this.zoneService.getZones();
    this.zones = data;
    this.globalStatusService.setLoading(false);
  }
}
