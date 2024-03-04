import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { CookieService } from "ngx-cookie-service";

import { Token } from "./token";
import { catchError, throwError } from "rxjs";

import { environment } from "../../../environment";

@Injectable({providedIn: 'root'})
export class AuthService {
    webApiKey = environment.apiKeyFirebase;

    private http = inject(HttpClient);
    private cookies = inject(CookieService);

    constructor() {}

    signup(email: string, password: string) {
        const body = new HttpParams()
            .set('email', email)
            .set('password', password)
            .set('returnSecureToken', 'true')
            
        this.http.post<Token>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.webApiKey}`, body)
            .pipe(catchError((error) => {
                return throwError(() => 'An unknown error occured');
            }))
            .subscribe({
                next: (token) => {
                    this.setToken(token);
                },
                error: (error) => {
                    console.log(error);
                }
            });

        return this.getToken();
    }

    login(email: string, password: string) {
        const body = new HttpParams()
            .set('email', email)
            .set('password', password)
            .set('returnSecureToken', 'true');

        this.http.post<Token>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.webApiKey}`, body)
            .pipe(catchError((error) => {
                return throwError(() => 'An unknown error occured');
            }))
            .subscribe({
                next: (token) => {
                    this.setToken(token);
                },
                error: (error) => {
                    console.log(error)
                }
            });
    }

    setToken(token: Token): void {
        this.cookies.set('token', JSON.stringify(token));
    }

    getToken(): string | null {
        if(this.tokenExists()) {
            return (JSON.parse(this.cookies.get('token')) as Token).idToken;
        }
        return null;
    }

    tokenExists(): boolean {
        return this.cookies.check('token');
    }
}