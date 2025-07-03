import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const canActivateFn: CanActivateFn = () => {
	const router = inject(Router);
	const isToken = localStorage.getItem('access_token');
	
	if (isToken) {
		return true;
	}

	// Redirige al login
	router.navigate(['/login']);
	return false;
	};