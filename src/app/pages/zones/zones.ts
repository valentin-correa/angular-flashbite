import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { ZoneService } from '../../services/zone.service';
import { GlobalStatusService } from '../../services/global-status.service';
import { CreateZone } from '../../components/create-zone/create-zone';
import Swal from 'sweetalert2';
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

  async confirmarEliminarZona(zona: any) {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: `Do you want to delete zone "${zona.name}" (ID: ${zona.id})?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#d33'
  });

  if (result.isConfirmed) {
    const response = await this.zoneService.deleteZone(zona.id);

    if (response.success) {
      Swal.fire('Deleted!', 'Zone has been deleted.', 'success');
      this.zones = this.zones.filter(z => z.id !== zona.id);
    } else {
      Swal.fire('Error', `There was a problem deleting the zone:\n${response.error}`, 'error');
    }
  }
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
