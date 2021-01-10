import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {etudiant,ETUDIANTS} from '../datas/etudiants';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit {

  constructor(private fb:FormBuilder) { }
  
  studentForm : FormGroup;

  Students : etudiant[] = ETUDIANTS;

  ngOnInit() {
    this.createForm();
  }

  createForm(){
    this.studentForm = this.fb.group({
      firstname:['',Validators.required],
      lastname:['',Validators.required],
      email:['',[Validators.required, Validators.email]],
      cin:['', Validators.required],
      field:['',Validators.required]
    })
  }
  onSubmit(){
    console.log(this.studentForm.value);
    this.Students.push(this.studentForm.value);
    this.studentForm.reset();
  }

}
