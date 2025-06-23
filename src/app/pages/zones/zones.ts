import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { ZoneService } from '../../services/zone.service';
import { GlobalStatusService } from '../../services/global-status.service';
import { CreateZone } from '../../components/create-zone/create-zone';
import { UpdateZone } from "../../components/update-zone/update-zone";


@Component({
  selector: 'app-zones',
  imports: [CreateZone, CommonModule, UpdateZone],
  templateUrl: './zones.html',
  styleUrl: './zones.css'
})
export class Zones implements OnInit {
  zones: Array<{ id: number, name: string, location: {lat: string, lng: string}, radius: number, deliveries: number[]}> = [];
  
  //variables para controlar la aparición de modals
  mostrarCreateZone=false;
  mostrarUpdateZone = false;
  zonaSeleccionada: any;

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
  
  agregarZona(zone: any): void { 
    const zoneWithoutDeliveries = {...zone, deliveries: []}

    this.zones = [...this.zones, zoneWithoutDeliveries]
    console.log(this.zones)
  }
  abrirUpdateZone(zone: any) {
  this.zonaSeleccionada = zone;
  this.mostrarUpdateZone = true;
}

  actualizarZonaActualizada(nuevaZona: any) {
    // Buscamos la zona vieja por el id y la reemplazamos por la nueva
    const index = this.zones.findIndex(z => z.id === nuevaZona.id);
    if (index !== -1) {
      this.zones[index] = nuevaZona;
    }
    this.mostrarUpdateZone = false; //cierra el modal de updateZone
  }

}
