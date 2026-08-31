import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, Teacher } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ProfessorsService {
  private apiUrl = `${environment.apiUrl}/Teachers`;

  constructor(private http: HttpClient) {}

  getProfessors(pageNumber: number = 1, pageSize: number = 10): Observable<ApiResponse<Teacher[]>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);
    return this.http.get<ApiResponse<Teacher[]>>(this.apiUrl, { params });
  }

  createProfessor(professor: Partial<Teacher>): Observable<ApiResponse<Teacher>> {
    return this.http.post<ApiResponse<Teacher>>(this.apiUrl, professor);
  }

  updateProfessor(id: number, professor: Partial<Teacher>): Observable<ApiResponse<Teacher>> {
    return this.http.put<ApiResponse<Teacher>>(`${this.apiUrl}/${id}`, professor);
  }

  deleteProfessor(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`);
  }
}