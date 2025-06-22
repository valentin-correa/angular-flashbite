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
  async createZone(zone:{name:string,location:{lat:number,lng:number},radius:number}):Promise<string>{
    try {
      await axiosService.post(
        config.urls.getZones,       
        zone
      );
      return "ok"; // si no hubo error, devuelve true
    } catch (error:any) {
    const message =
      error.response?.data?.message ||  // si existe un mensaje de error que manda el backend lo uso
      error.message ||                  // mensaje generado por Axios
      "Unknown Error";                  // por si no se obtiene
    return message;
  }
  }
  
}
