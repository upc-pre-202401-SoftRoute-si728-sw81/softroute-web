import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LayoutService } from '../../../shared/layout/service/app.layout.service';

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    styles: [`
        :host ::ng-deep .p-password input {
            width: 100%;
            padding:1rem;
        }

        :host ::ng-deep .pi-eye {
            transform: scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }

        :host ::ng-deep .pi-eye-slash {
            transform: scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})
export class SignUpComponent {

    valCheck: string[] = ['remember'];
    firstName!: string;
    lastName!: string;
    dni!: string;
    birthDate!: string;
    phoneNumber!: string;
    email!: string;
    password!: string;

    constructor(
        public layoutService: LayoutService,
        private http: HttpClient,
        private router: Router
    ) { }

    signUp() {
        const signUpData = {
            firstName: this.firstName,
            lastName: this.lastName,
            dni: this.dni,
            birthDate: this.birthDate,
            phoneNumber: this.phoneNumber,
            email: this.email,
            password: this.password
        };

        this.http.post('http://34.73.4.208:8080/api/v1/auth/sign-up', signUpData)
            .subscribe((response: any) => {
                console.log(response);
                this.router.navigate(['/dashboard']);
            }, error => {
                console.error(error);
            });
    }
}
