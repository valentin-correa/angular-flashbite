import axios from 'axios';

export const axiosService = axios.create({
	//baseURL: 'https://api.ejemplo.com', // Cambiar por tu baseURL real
	headers: {
        'Content-Type': 'application/json',
	},
});



// Interceptor para agregar el token a cada request
axiosService.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('access_token');
		if (token) {
			
			config.headers.Authorization = `Bearer ${token}`;
			config.headers.Authorization = token;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);