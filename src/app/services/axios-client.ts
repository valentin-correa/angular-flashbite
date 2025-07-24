import axios from 'axios';

export const axiosService = axios.create({
	headers: {
        'Content-Type': 'application/json',
	},
}); //crea una instancia de Axios con una configuración po defecto (todas las peticiones estarán en formato JSON)



// Interceptor para agregar el token a cada request
axiosService.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('access_token');
		if (token) {
			
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);