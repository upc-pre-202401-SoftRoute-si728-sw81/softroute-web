import { Component, OnInit, inject } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client';
import { TableModule } from 'primeng/table';
@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [TableModule],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css',
})
export class ClientsComponent implements OnInit {
  private _clientService = inject(ClientService);

  clients?: Client[];

  ngOnInit(): void {
    this._clientService.getAll().subscribe((data) => (this.clients = data));
  }
}
