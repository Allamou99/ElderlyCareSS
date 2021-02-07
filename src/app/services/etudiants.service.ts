
import { Injectable } from '@angular/core';
import {ETUDIANTS, etudiant,url} from '../datas/etudiants';
import {Observable,of , pipe} from 'rxjs';
import { delay } from 'rxjs/operators';
import {HttpClient,HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EtudiantsService {
  constructor(private http : HttpClient) { }

  getEtudiant() : Observable<etudiant[]>{
    return this.http.get<etudiant[]>(url +'etudiants')
    .pipe(delay(4000));
    
  }

  postEtudiant(student : etudiant) : Observable<etudiant>{
    const httpOptions = {
      headers : new HttpHeaders({
        'Content-Type' : 'application/json',
      })
    }
    return this.http.post<etudiant>(url +'etudiants' , student , httpOptions);
  }
}