import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpClient, HttpResponse } from '@angular/common/http'
import { Observable, of } from 'rxjs';
import { map, delay} from 'rxjs/operators';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

  private _productJsonPath = "/assets/products.json";
  constructor(private http: HttpClient) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.handleRequests(req, next);
  }
  /**
   * Handle request's and support with mock data.
   * @param req
   * @param next
   */
  handleRequests(req: HttpRequest<any>, next: HttpHandler): any {
    const { url, method } = req;
    console.log('Intercept', method)
    if (url.endsWith("/products/") && method === "GET") {
      req = req.clone({
        url: this._productJsonPath,
      });
      return next.handle(req).pipe(delay(500));
    }
    if (url.endsWith("/products/") && method === "POST") {
      const { body } = req.clone();
      // assign a new uuid to new product
        body.id = uuidv4();
      return of(new HttpResponse({ status: 200, body })).pipe(delay(500));
    }
    if (url.endsWith("/products/") && method === "PUT") {
      const { body } = req.clone();
      return of(new HttpResponse({ status: 200, body })).pipe(delay(500));
    }

    if (url.match(/\/products\/.*/) && method === "DELETE") {
      const empId = this.getProductId(url);
      return of(new HttpResponse({ status: 200, body: empId })).pipe(
        delay(500)
      );
    }
    // if there is not any matches return default request.
    return next.handle(req);
  }
  /**
   * Get Product unique uuid from url.
   * @param url
   */
  getProductId(url: any) {
    const urlValues = url.split("/");
    return urlValues[urlValues.length - 1];
  }
}

export let fakeBackendProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: HttpInterceptorService,
  multi: true,
};
