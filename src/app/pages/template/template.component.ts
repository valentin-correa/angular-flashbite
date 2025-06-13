import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GlobalStatusService } from '../../services/global-status.service';
import { Navbar } from '../../components/navbar/navbar';

@Component({
  selector: 'app-template',
  imports: [RouterOutlet, Navbar],
  templateUrl: './template.component.html',
  styleUrl: './template.component.css',
})
export class TemplateComponent {
  constructor(private globalStatusService: GlobalStatusService) {}

  isLoading(): boolean {
    return this.globalStatusService.isLoading();
  }
}
