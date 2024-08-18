import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { IProduct } from './models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private http: HttpClient) {}
  /**
   * Get All Products request.
   */
  getAllProducts(): Observable<any> {
    return this.http
      .get<any>("http://localhost:4200/products/", { observe: "response" })
      .pipe(
        retry(3), // retry a failed request up to 3 times
        catchError(this.handleError) // then handle the error
      );
  }
  /**
   * Add a new product post request.
   * @param product a new product to add.
   */
  addProduct(product: IProduct): Observable<any> {
    return this.http
      .post<any>("http://localhost:4200/products/", product, {
        observe: "response",
      })
      .pipe(catchError(this.handleError));
  }
 /**
   * Edit product post request.
   * @param product a product to edit
   */
  editProduct(product: IProduct): Observable<any> {
    return this.http
      .put<any>("http://localhost:4200/products/", product, {
        observe: "response",
      })
      .pipe(catchError(this.handleError));
  }
  /**
   * Delete an product request method.
   * @param empId product unique id
   */
  deleteProduct(empId: string) {
    return this.http
      .delete<any>("http://localhost:4200/products/" + empId, {
        observe: "response",
      })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error("An error occurred:", error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // return an observable with a user-facing error message
    return throwError("Something bad happened; please try again later.");
  }
}
