import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private http: HttpClient) {}
  /**
   * Get All Products request.
   */
  getAllProducts(): Observable<any> {
    console.log('get all')
    return this.http
      .get<any>("http://localhost:4200/products/", { observe: "response" })
      .pipe(
        retry(3), // retry a failed request up to 3 times
        catchError(this.handleError) // then handle the error
      );
  }
  /**
   * Add a new employee post requts.
   * @param employee a new employee to add.
   */
  addProduct(employee: any): Observable<any> {
    console.log('add Product', employee)
    return this.http
      .post<any>("http://localhost:4200/products/", employee, {
        observe: "response",
      })
      .pipe(catchError(this.handleError));
  }
/**
   * Edit product post requts.
   * @param employee a new employee to add.
   */
  editProduct(product: any): Observable<any> {
    console.log('edit Product', product)
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
  deleteProduct(empId: any) {
    console.log('delete product', empId)
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
