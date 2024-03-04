import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";

const TOKEN_HEADER_KEY = 'Authorization';

/**
 * This interceptor is meant to handle authorization
 * 
 * The idea is:
 * - The client stores an auth-token and a refresh-token
 * - The auth-token lasts for 8 hours and the refresh-token
 * - can be used to get a new token for an hour
 * - When a request falls with 401, the interceptor will try to refresh the token
 * - The client will attain a new token, and repeat all the requests that failed with 401
 * - The client will refresh the token only once. That is why all the requests that fail with 401,
 * - will be put in a queue and repeated only after the token is refreshed.
 * - If refreshing the token fails, we consider the session to have expired.
 */
export class DataInterceptor implements HttpInterceptor {

    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor() {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let authReq = req;
        const token: string | null = null;
        if(token !== null) {
            authReq = this.addTokenHeader(req, token);
        }

        return next.handle(authReq);
    }

    addTokenHeader(request: HttpRequest<any>, token: string | null): HttpRequest<any> {
        return request.clone({ headers : request.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token)});
    }
}