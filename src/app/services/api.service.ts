import { Injectable } from '@angular/core';
import axios from 'axios';
import { config } from '../config/env';
import { Meal } from '../interfaces/meal.interface';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor() {}

  async getData(): Promise<Meal> {
    const meal = (await axios.get(config.urls.getFood)).data.meals[0]

    const image = meal.strMealThumb

    const name = meal.strMeal

    return {image, name}
  }
}
