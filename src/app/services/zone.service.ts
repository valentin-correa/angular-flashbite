import { Injectable } from '@angular/core';
import axios from 'axios';
import { config } from '../config/env';

@Injectable({
  providedIn: 'root'
})
export class ZoneService {
  constructor() { }

  async getZones(): Promise<Array<{ id: number, name: string, location: {lat: string, lng: string}, radius: number, deliveries: number[] }>> {
    
    const token = localStorage.getItem('token');

    const response = await axios.get(config.urls.getZones, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": 'application/json'
      }
    });

    return response.data
  }
}
