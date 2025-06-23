import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ZoneService } from '../../services/zone.service';
import { GlobalStatusService } from '../../services/global-status.service';

@Component({
  selector: 'create-zone-modal',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './create-zone.html',
  styleUrl: './create-zone.css'
})
export class CreateZone {

  @Output() cerrar = new EventEmitter<void>();
  @Output() crearZona = new EventEmitter<any>();

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
      confirmButtonText: '¡Yes, add zone!',
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
      const result = await this.createNewZone(data);

      if (result?.success) {
        this.crearZona.emit(result.data)
        this.error = '';
        this.onCerrar();
      }
    }
  });
}
async createNewZone(data:{name:string,location:{lat:number,lng:number},radius:number}){
  this.globalStatusService.setLoading(true);
  const response=await this.zoneService.createZone(data);
  this.globalStatusService.setLoading(false);
  if (response.success){
    Swal.fire({
      title: '¡Zone created!',
      icon:'success',      
    })
    
    return {success: true, data: response.data}

    }else{
      Swal.fire({
      title: `There's been a problem creating zone.\n ${response.error}`,
      icon:'error',      
    })

    return { success:false }
    }

  }
}
