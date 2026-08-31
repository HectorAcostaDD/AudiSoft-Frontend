import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, Student } from '../models/models';

@Injectable({ providedIn: 'root' })
export class StudentsService {
  private apiUrl = `${environment.apiUrl}/Students`;

  constructor(private http: HttpClient) {}

  getStudents(pageNumber: number = 1, pageSize: number = 10): Observable<ApiResponse<Student[]>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);
    return this.http.get<ApiResponse<Student[]>>(this.apiUrl, { params });
  }

  createStudent(student: Partial<Student>): Observable<ApiResponse<Student>> {
    return this.http.post<ApiResponse<Student>>(this.apiUrl, student);
  }

  updateStudent(id: number, student: Partial<Student>): Observable<ApiResponse<Student>> {
    return this.http.put<ApiResponse<Student>>(`${this.apiUrl}/${id}`, student);
  }

  deleteStudent(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`);
  }
}