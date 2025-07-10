import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { GlobalStatusService } from '../../services/global-status.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  items: Array<{ image: string; name: string;}> = [];
  constructor(
    private readonly apiService: ApiService,
    private readonly globalStatusService: GlobalStatusService
  ) {}
  ngOnInit(): void {
    this.initialization();
  }

  async initialization(): Promise<void> {
    this.globalStatusService.setLoading(true);
    for (var i = 0;i < 6 ; i++) {
      const data = await this.apiService.getData();
      this.items.push(data);
    }
    this.globalStatusService.setLoading(false);
  }
}
