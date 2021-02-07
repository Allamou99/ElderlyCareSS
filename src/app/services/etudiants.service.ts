  
import { Injectable } from '@angular/core';
import {ETUDIANTS, etudiant,url} from '../datas/etudiants';
import {Observable,of} from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class EtudiantsService {
  constructor() { }

  getEtudiant() : Observable<etudiant[]>{
    return of(ETUDIANTS);
  }

}