import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { axiosService } from '../../services/axios-client';

@Component({
  selector: 'app-register',
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  formulario: FormGroup;
  error = '';
  submitted = false;
  successMessage = '';
  constructor(private fb: FormBuilder, private router: Router) {
    this.formulario = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required,Validators.minLength(8)]],
      passwordValidation: ['', [Validators.required,Validators.minLength(8)]]
    }, { validators: this.passwordsMatchValidator });
  }
  
  async register() {
    this.submitted = true;
    if (this.formulario.invalid) {
      this.error = 'Completa todos los campos correctamente.';
      return;
    }

    const { firstName, lastName, email, password, passwordValidation } = this.formulario.value

    try {
      const response = await axiosService.post('http://localhost:3001/register', {
        email,
        password
      });

      this.error = '';
      this.successMessage = "User successfully registered"
      setTimeout(() => {
        this.router.navigate(['login'])
      }, 2000)
      
    }

    catch (err: any) {
      this.error = err.response?.data?.message || 'Error al registrar usuario.';
    }
  }

  passwordsMatchValidator(form: AbstractControl) { //validador personalizado
    const password = form.get('password')?.value;
    const confirmPassword = form.get('passwordValidation')?.value;
    if (password !== confirmPassword) {
      return { passwordMismatch: true };  // devuelve error
    }
    return null; // no devuelve error, formulario válido
  }
}
