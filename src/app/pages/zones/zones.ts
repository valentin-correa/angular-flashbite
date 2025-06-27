import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { ZoneService } from '../../services/zone.service';
import { GlobalStatusService } from '../../services/global-status.service';
import { CreateZone } from '../../components/create-zone/create-zone';
import Swal from 'sweetalert2';
import { UpdateZone } from "../../components/update-zone/update-zone";
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-zones',
  imports: [CreateZone, CommonModule, UpdateZone, FormsModule],
  templateUrl: './zones.html',
  styleUrl: './zones.css'
})
export class Zones implements OnInit, OnDestroy {
  zones: Array<{ id: number, name: string, location: {lat: string, lng: string}, radius: number, deliveries: number[]}> = [];
  
  //variables para controlar la aparición de modals
  mostrarCreateZone=false;
  mostrarUpdateZone = false;
  zonaSeleccionada: any;
  zonaBuscadaInput: string = ''
  private routeSub!: Subscription
  zonaNoEncontrada: boolean = false;
  idNoEncontrado: string = '';

  constructor(private zoneService: ZoneService, private globalStatusService: GlobalStatusService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
      this.initialization()
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  redirigirZonaPorID(): void {
    const id = this.zonaBuscadaInput.trim();

    if (id) {
      this.router.navigate(['/zones', id])
    } else {
      this.router.navigate(['/zones'])
    }
  }

  async buscarZonas(zoneID: string | null): Promise<void> {
    this.zonaNoEncontrada = false;

  if (zoneID) {
    try {
      const zone = await this.zoneService.getZoneByID(zoneID);
      if (zone) {
        this.zones = [zone];
      } else {
        this.zones = [];
        this.zonaNoEncontrada = true;
        this.idNoEncontrado = zoneID;
      }
    } catch (error) {
      this.zones = [];
      this.zonaNoEncontrada = true;
      this.idNoEncontrado = zoneID;

      console.error('Error al obtener zona por ID:', error);
    }
  } else {
    try {
      this.zones = await this.zoneService.getZones();
    } catch (error) {
      this.zones = [];
      console.error('Error al obtener zonas:', error);
    }
  }
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
    this.routeSub = this.route.paramMap.subscribe(async params => {
      const zoneID = params.get('id');
      this.zonaBuscadaInput = zoneID || '';
      await this.buscarZonas(zoneID);
    this.globalStatusService.setLoading(false);
  });
}
  
  agregarZona(zone: any): void { 
    const zoneWithoutDeliveries = {...zone, deliveries: []}

    this.zones = [...this.zones, zoneWithoutDeliveries]
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
