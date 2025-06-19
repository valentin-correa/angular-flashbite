import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'create-zone-modal',
  imports: [CommonModule],
  templateUrl: './create-zone.html',
  styleUrl: './create-zone.css'
})
export class CreateZone {

  @Output() cerrar = new EventEmitter<void>();

  onCerrar() {
    this.cerrar.emit(); // Notifica al padre que se debe cerrar
  }
}
