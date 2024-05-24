import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(private readonly storage: Storage) {
    this.storage.create();
  }

  async set(key: string, value: any) {
    return this.storage.set(key, value);
  }

  async get(key: string) {
    return this.storage.get(key);
  }
}
