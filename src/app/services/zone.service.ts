import { Injectable } from '@angular/core';
import axios from 'axios';
import { config } from '../config/env';
import { axiosService } from './axios-client';

@Injectable({
  providedIn: 'root'
})
export class ZoneService {
  constructor() { }

  async getZones(): Promise<Array<{ id: number, name: string, location: {lat: string, lng: string}, radius: number, deliveries: number[] }>> {
    
   // const token = localStorage.getItem('token');

    const response = await axiosService.get(config.urls.getZones, {
    });

    return response.data
  }
}
