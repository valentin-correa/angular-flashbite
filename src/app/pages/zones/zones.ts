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
import { Zone, ZoneWithoutID } from '../../interfaces/zone.interface';

@Component({
  selector: 'app-zones',
  imports: [CreateZone, CommonModule, UpdateZone, FormsModule],
  templateUrl: './zones.html',
  styleUrl: './zones.css'
})
export class Zones implements OnInit, OnDestroy {
  zones: Array<Zone> = [];

  //variables para controlar la aparición de modals
  mostrarCreateZone = false;
  mostrarUpdateZone = false;
  zonaSeleccionada!: Zone;
  zonaBuscadaInput: string = ''
  private routeSub!: Subscription
  zonaNoEncontrada: boolean = false;
  idNoEncontrado: string = '';
  page: number = 1;
  nextZone: Array<Zone> = [];
  quantity: number | null = null; // null para que se vea el placeholder inicialmente
  hayMasZonas: boolean = true; // para saber si mostrar botón de siguiente

  constructor(private zoneService: ZoneService, private globalStatusService: GlobalStatusService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.initialization()
  }

  ngOnDestroy(): void {
    //Antes de que Angular destruya el componente limpia la suscripción a los parámetros de la ruta, para evitar fugas de memoria o efectos secundarios inesperados.
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
      // Buscar por ID específica (sin paginación)
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


      }
    } else {
      try {
        const cantidad = this.quantity ?? 10; //le doy valor por defecto 10 y me aseguro de que sea un número y no null
        this.zones = await this.zoneService.getZones(this.page, cantidad);
        this.verificarSiguienteZona((this.page * cantidad) + 1)


      } catch (error) {
        this.zones = [];
        console.error('Error al obtener zonas:', error);
        Swal.fire('Error', `There was a problem loading the zones:\n${error}`, 'error');
      }
    }
  }

  async confirmarEliminarZona(zona: Zone) {
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
        this.zones = this.zones.filter(z => z.id !== zona.id); //filtra la zona eliminada
        if (this.hayMasZonas) {
          this.zones = [...this.zones, ...this.nextZone]; //agrego la zona siguiente para q se vea en pantalla

          //busco en el mismo indice donde antes estaba la nextZone si ahora hay otra o ya no hay pag siguiente
          const cantidad = this.quantity ?? 10; //le doy valor por defecto 10 y me aseguro de que sea un número y no null
          this.verificarSiguienteZona((this.page * cantidad) + 1)
        } else if (this.zones.length == 0 && this.page > 1) { //si la página quedo vacía y no es la primera
          this.cambiarPagina("anterior");
        }

      } else {
        Swal.fire('Error', `There was a problem deleting the zone:\n${response.error}`, 'error');
      }
    }
  }

  async initialization(): Promise<void> {
    this.globalStatusService.setLoading(true);

    //Se suscribe a cambios en los parámetros de la ruta
    //Cuando cambian los parámetros (cambia la URL), extrae el ID (si no está el parametro deja una cadena vacía),
    // actualiza lo que se debe buscar y hace la búsqueda (buscarZonas()).
    this.routeSub = this.route.paramMap.subscribe(async params => {
      const zoneID = params.get('id');
      this.zonaBuscadaInput = zoneID || '';
      await this.buscarZonas(zoneID);
      this.globalStatusService.setLoading(false);
    });
  }
  async verificarSiguienteZona(nextZoneIndex: number) {
    //Traigo el primer elemento de la siguiente página, y según si existe asigno valor a HayMasZonas
    this.nextZone = await this.zoneService.getZones(nextZoneIndex, 1);
    this.hayMasZonas = (this.nextZone.length > 0)
  }

  agregarZona(zone: Zone): void {
    if (this.zones.length < (this.quantity ?? 10)) { //si ya se muestran 10 zonas no la agrego a la vista
      this.zones = [...this.zones, zone];
    } else {
      // Si agregamos una zona pero ya alcanzamos el límite visual, asumimos que hay más zonas
      this.hayMasZonas = true;
    }

  }
  abrirUpdateZone(zone: Zone) {
    this.zonaSeleccionada = zone;
    this.mostrarUpdateZone = true;
  }

  actualizarZona(nuevaZona: Zone) {
    // Buscamos la zona vieja por el id y la reemplazamos por la nueva
    const index = this.zones.findIndex(z => z.id === nuevaZona.id);
    if (index !== -1) {
      this.zones[index] = nuevaZona;
    }
    this.mostrarUpdateZone = false; //cierra el modal de updateZone
  }

  async aplicarCantidad() {
    const cantidad = this.quantity;
    if (typeof cantidad === 'number' && cantidad > 0) { //valida que no sea Null, NAN ni 0
      this.page = 1;//reseteo a 1 para asegurar que tendremos un resultado valido (la nueva combinación de page y quantity podría devolver algo vacío)
      await this.buscarZonas(null);
    }
  }

  cambiarPagina(direccion: 'anterior' | 'siguiente') {
    //hago devuelta las validaciones de page>1 y hayMasZonas para hacerlo más robusto y prevenir manipulacion del DOM
    if (direccion === 'anterior' && this.page > 1) {
      this.page--;
      this.buscarZonas(null);
    }
    if (direccion === 'siguiente' && this.hayMasZonas) {
      this.page++;
      this.buscarZonas(null);
    }
  }


}
