import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, Score } from '../models/models';

@Injectable({ providedIn: 'root' })
export class NotesService {
  private apiUrl = `${environment.apiUrl}/Scores`;

  constructor(private http: HttpClient) {}

  getNotes(pageNumber: number = 1, pageSize: number = 10): Observable<ApiResponse<Score[]>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);
    return this.http.get<ApiResponse<Score[]>>(this.apiUrl, { params });
  }

  createNote(note: Partial<Score>): Observable<ApiResponse<Score>> {
    return this.http.post<ApiResponse<Score>>(this.apiUrl, note);
  }

  updateNote(id: number, note: Partial<Score>): Observable<ApiResponse<Score>> {
    return this.http.put<ApiResponse<Score>>(`${this.apiUrl}/${id}`, note);
  }

  deleteNote(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`);
  }
}