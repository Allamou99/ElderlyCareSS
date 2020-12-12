

import { Component, OnInit } from '@angular/core';
import {EtudiantsService} from '../services/etudiants.service';
import {etudiant} from '../datas/etudiants';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  EtudiantM : etudiant[];
  EtudiantNM : etudiant[];


  constructor(private etudiantService : EtudiantsService) { }
    ngOnInit() {
      this.EtudiantM = this.etudiantService.getMajorant();
      this.EtudiantNM = this.etudiantService.getNonMajorant();
      console.log(this.EtudiantM);
      console.log(this.EtudiantNM);
  }
}
