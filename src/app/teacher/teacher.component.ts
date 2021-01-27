

import { Component, OnInit } from '@angular/core';
import {Observable,of} from 'rxjs';


@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.scss']
})
export class TeacherComponent implements OnInit {

  constructor() { }
  
  ngOnInit() {

    console.log('Teacher');
  }

}
