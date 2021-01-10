

import { Component, OnInit } from '@angular/core';
import {EtudiantsService} from '../services/etudiants.service';
import {etudiant} from '../datas/etudiants';
declare const L:any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  

  constructor(private etudiantService : EtudiantsService) { }
    ngOnInit() {
  }
  

}
