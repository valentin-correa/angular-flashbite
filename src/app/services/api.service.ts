import { Injectable } from '@angular/core';
import axios from 'axios';
import { config } from '../config/env';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor() {}

  async getData(): Promise<{ image: string; name: string; }> {
    const meal = (await axios.get(config.urls.getFood)).data.meals[0]

    const image = meal.strMealThumb

    const name = meal.strMeal

    return {image, name}
  }
}
