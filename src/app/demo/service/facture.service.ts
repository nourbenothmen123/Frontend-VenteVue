import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Facture } from '../api/facture'; 

@Injectable({
  providedIn: 'root'
})
export class FactureService {
  private baseURL = 'http://localhost:7777/factures'; // Remplacez par l'URL de votre backend

  constructor(private http: HttpClient) {}

  calculateCAByMonthAndYear(month: number, year: number): Observable<number> {
    return this.http.get<number>(`${this.baseURL}/calculateCAByMonthAndYear?month=${month}&year=${year}`);
  }

  calculateCAByYear(year: number): Observable<number> {
    return this.http.get<number>(`${this.baseURL}/calculateCAByYear?year=${year}`);
  }

  getFacturesByStatus(status: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseURL}/status/${status}`);
  }
  calculateCAByWeekAndYear(week: number, year: number): Observable<number> {
    return this.http.get<number>(`${this.baseURL}/calculateCAByWeekAndYear?week=${week}&year=${year}`);
  }
}
