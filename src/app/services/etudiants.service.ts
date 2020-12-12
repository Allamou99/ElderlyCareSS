import { Injectable } from '@angular/core';
import {ETUDIANTS} from '../datas/etudiants';


@Injectable({
  providedIn: 'root'
})
export class EtudiantsService {

  constructor() { }

  getMajorant(){
    return ETUDIANTS.filter(element=>element.majorant);
  }

  getNonMajorant(){
    return ETUDIANTS.filter(element=>!element.majorant);
  }



}
