import { Component, OnInit , OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {etudiant,ETUDIANTS} from '../datas/etudiants';
import {EtudiantsService} from '../services/etudiants.service';
import {Subscription} from 'rxjs';


@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit {

  constructor(private fb:FormBuilder,
  private serviceEtudiant : EtudiantsService) { }
  
  studentForm : FormGroup;
    subscripiton : Subscription;
  Students : etudiant[];

  ngOnInit() {
    this.subscripiton = this.serviceEtudiant.getEtudiant()
    .subscribe(etd => this.Students = etd , err=>console.log(err));
    this.createForm();
  }

  ngOnDestroy(){
    this.subscripiton.unsubscribe;
  }

  createForm(){
    this.studentForm = this.fb.group({
      firstname:['',Validators.required],
      lastname:['',Validators.required],
      email:['',[Validators.required, Validators.email]],
      cin:['', Validators.required],
      field:['',Validators.required],
      moyenne:['',[Validators.required, Validators.pattern('^[0-9]*$')]]
    })
  }
  onSubmit(){
    console.log(this.studentForm.value);
    this.Students.push(this.studentForm.value);
    this.studentForm.reset();
  }
}
