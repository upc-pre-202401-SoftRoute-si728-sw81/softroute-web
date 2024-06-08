import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LayoutService } from '../../../shared/layout/service/app.layout.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
        :host ::ng-deep .p-password input {
            width: 100%;
            padding:1rem;
        }

        :host ::ng-deep .pi-eye{
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }

        :host ::ng-deep .pi-eye-slash{
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})
export class LoginComponent {

    valCheck: string[] = ['remember'];
    email!: string;
    password!: string;

    constructor(
        public layoutService: LayoutService,
        private http: HttpClient,
        private router: Router
    ) { }

    login() {
        const loginData = {
            email: this.email,
            password: this.password
        };

        this.http.post('http://34.73.4.208:8080/api/v1/auth/sign-in', loginData)
            .subscribe((response: any) => {
                // Manejar la respuesta aquí
                console.log(response);
                localStorage.setItem('token', response.token);
                this.router.navigate(['/dashboard']);
            }, error => {
                // Manejar el error aquí
                console.error(error);
            });
    }
}
