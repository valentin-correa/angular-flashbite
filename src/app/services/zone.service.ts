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
  async createZone(zone:{name:string,radius:number,location:{lat:number,lng:number}}):Promise<string>{
    const token = localStorage.getItem('token');
    try {
    await axios.post(
      config.urls.getZones,       
      zone,
      {headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }}
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
