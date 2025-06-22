import { Component } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { axiosService } from '../../services/axios-client';
import { inject } from '@angular/core';


@Component({
  selector: 'app-login',
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  formulario: FormGroup;
  error = '';
  constructor(private fb: FormBuilder, private router: Router) {
	  this.formulario = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
	  password: ['', [Validators.required]]
	  });
  }

  async login() {
	  if (this.formulario.invalid) {
	    this.error = 'Completa todos los campos correctamente.';
	    return;
    }

    const { email, password } = this.formulario.value

    try {
      const response = await axiosService.post('http://localhost:3001/login', {
        email,
        password
      });
      
      this.error = ''

      localStorage.setItem('access_token', response.data.token)
      this.router.navigate(['zones'])

    }

    catch (err: any) { 
      this.error = err.response?.data?.message || 'Error al iniciar sesión';
    }
  }
}
