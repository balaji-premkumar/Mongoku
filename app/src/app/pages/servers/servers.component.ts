import { Component, OnInit } from '@angular/core';
import { MongoDbService, ServerJSON } from '../../services/mongo-db.service';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-servers',
  templateUrl: './servers.component.html',
  styleUrls: ['./servers.component.scss']
})
export class ServersComponent implements OnInit {
  servers: ServerJSON[] = [];
  loading = true;
  adding = false;
  newServer = "";

  constructor(private mongoDb: MongoDbService) { }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.loading = true;
    this.mongoDb.getServers()
      .subscribe(data => {
        this.loading = false;
        if (Array.isArray(data)) {
          this.servers = data;
        }
      });
  }

  toggle(popover: NgbPopover, collection: any[]) {
    if (popover.isOpen()) {
      popover.close();
    } else if (collection !== undefined) {
      const clippedCol = collection.filter((_, i) => i < 20);
      popover.open({
        collection: clippedCol,
        clipped: collection.length - clippedCol.length
      });
    }
  }

  addServer() {
    this.mongoDb.addServer(this.newServer)
      .subscribe((data: any) => {
        if (data.ok) {
          this.refresh();
        }
      });
  }

  removeServer(server: ServerJSON) {
    this.mongoDb.removeServer(server.name)
      .subscribe((data: any) => {
        if (data.ok) {
          this.refresh();
        }
      });
  }
}
