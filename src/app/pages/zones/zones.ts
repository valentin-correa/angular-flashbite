import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { ZoneService } from '../../services/zone.service';
import { GlobalStatusService } from '../../services/global-status.service';
import { CreateZone } from "./create-zone/create-zone";

@Component({
  selector: 'app-zones',
  imports: [CreateZone,CommonModule],
  templateUrl: './zones.html',
  styleUrl: './zones.css'
})
export class Zones implements OnInit {
  zones: Array<{ id: number, name: string, location: {lat: string, lng: string}, radius: number, deliveries: number[]}> = [];
  
  //variables para controlar la aparición de modals
  mostrarCreateZone=false;
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
