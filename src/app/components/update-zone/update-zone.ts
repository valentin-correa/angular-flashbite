import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ZoneService } from '../../services/zone.service';
import { GlobalStatusService } from '../../services/global-status.service';
import { Zone, ZoneWithoutID } from '../../interfaces/zone.interface';
@Component({
  selector: 'update-zone-modal',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './update-zone.html',
  styleUrl: './update-zone.css'
})
export class UpdateZone {
  @Output() cerrar = new EventEmitter<void>();
  @Input() zona!: Zone;
  @Output() zonaActualizada = new EventEmitter<Zone>();

  onCerrar() {
    this.cerrar.emit(); // Notifica al padre que se debe cerrar
  }
  formulario: FormGroup;
  error = '';
  constructor(private zoneService: ZoneService, private fb: FormBuilder,private globalStatusService: GlobalStatusService) {
    this.formulario = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      radio: [null, [Validators.required, Validators.min(0)]],
      latitud: [null, [Validators.required, Validators.min(-90),Validators.max(90)]],
      longitud: [null, [Validators.required, Validators.min(-180), Validators.max(180)]]
    });
  }
  async send() {
    if (this.formulario.invalid) {
      this.error = 'Completa todos los campos correctamente.';
      return;
    }
    Swal.fire({
      title: '¿Are you sure?',
      icon:'question',
      showDenyButton: true,
      confirmButtonText: '¡Yes, update zone!',
      confirmButtonColor:'#333e8f',
      denyButtonText: 'No, go back',
      
    }).then(async (swalResult) => {
      if (swalResult.isConfirmed) {
        const form = this.formulario.value;
      const data = {
        //las siguientes validaciones sirven para ocntrarrestrar manipulaciones del html en el navegador
        name: (form.nombre ?? '').trim(),  // asegura que no sea null y remueve espacios
        location: {
          lat: Number(form.latitud),
          lng: Number(form.longitud)
        },
        radius: Number(form.radio),        // convierte a number para garantizar
      };
      const result = await this.updateZone(data);
      if (result?.success) {
        this.zonaActualizada.emit(result.data)
        this.error = '';
        this.onCerrar();
      }
    }
  });
}
async updateZone(data:ZoneWithoutID){
  this.globalStatusService.setLoading(true);
  const response=await this.zoneService.updateZone(data,this.zona.id);
  this.globalStatusService.setLoading(false);
  if (response.success){
    Swal.fire({
      title: '¡Zone updated!',
      icon:'success',      
    })
    
    return {success: true, data: response.data}

    }else{
      Swal.fire({
      title: `There's been a problem updating the zone.\n ${response.error}`,
      icon:'error',      
    })

    return { success:false }
    }

  }
  ngOnInit() {
    //precargo el formulario con los actuales datos del evento
    if (this.zona) {
      this.formulario.patchValue({
        nombre: this.zona.name,
        radio: this.zona.radius,
        latitud: this.zona.location.lat,
        longitud: this.zona.location.lng
      });
    }
}
}



