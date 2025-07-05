import { Injectable } from '@angular/core';
import axios from 'axios';
import { config } from '../config/env';
import { axiosService } from './axios-client';

@Injectable({
  providedIn: 'root'
})
export class AuthService{
    constructor() { }
    async login(email:string,password:string){

    }
    async register(email:string,password:string){

    }
}