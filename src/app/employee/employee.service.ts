import { Injectable } from '@angular/core';
import { IEmployee } from './IEmployee';
import { HttpClient, HttpErrorResponse,HttpHeaders ,HttpClientModule } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError} from 'rxjs/operators';

@Injectable()
export class EmployeeService {
    constructor(
        private http : HttpClient
    ){}
    baseUrl = "http://localhost:3000/employees";

    getEmployees():Observable<IEmployee[]>{
        return this.http.get<IEmployee[]>(this.baseUrl)
        .pipe (catchError(this.handleError));
    }

    private handleError(errorResponse:HttpErrorResponse){
        if( errorResponse.error instanceof ErrorEvent){
            console.log("client side error", errorResponse.error);
        } else{
            console.log("Server side error", errorResponse);
        }
        return throwError('There is a problem with the error');
    }
   
    getEmployee(id: number): Observable<IEmployee> {
        return this.http.get<IEmployee>(`${this.baseUrl}/${id}`)
            .pipe(catchError(this.handleError));
    }
    
    addEmployee(employee: IEmployee): Observable<IEmployee> {
        return this.http.post<IEmployee>(this.baseUrl, employee, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        })
        .pipe(catchError(this.handleError));
    }

    updateEmployee(employee: IEmployee): Observable<void> {
        return this.http.put<void>(`${this.baseUrl}/${employee.id}`, employee, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        })
            .pipe(catchError(this.handleError));
    }

    deleteEmployee(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`)
            .pipe(catchError(this.handleError));
    }

}