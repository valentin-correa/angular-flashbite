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
  async createZone(zone:{name:string,location:{lat:number,lng:number},radius:number}):Promise<{
    success: true; data: any} | {success: false; error: string}
  >{
    try {
      const response =  await axiosService.post(
        config.urls.getZones,       
        zone
      );

      if (response.status===201) {
        return { success: true, data: response.data}
      } else {
        return { success: false, error: `Unexpected response code: ${response.status}`}
      }

    } catch (error:any) {
    const message =
      error.response?.data?.message ||  // si existe un mensaje de error que manda el backend lo uso
      error.message ||                  // mensaje generado por Axios
      "Unknown Error";                  // por si no se obtiene
    return { success: false, error: message };
  }
  }
  
  async deleteZone(id: number): Promise<{success: true; data: any} | {success: false; error: string}> {
    try {
      const response = await axiosService.delete(
        `${config.urls.getZones}/${id}`
      );

      if (response.status===200) {
        return { success: true, data: response.data}
      } else {
        return { success: false, error: `Unexpected response code: ${response.status}`}
      }
    }

    catch (error: any) {
      const message =
      error.response?.data?.message ||  // si existe un mensaje de error que manda el backend lo uso
      error.message ||                  // mensaje generado por Axios
      "Unknown Error";                  // por si no se obtiene

      return { success: false, error: message}
    }
  }
}
