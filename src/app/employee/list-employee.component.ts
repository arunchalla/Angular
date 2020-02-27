import { Component, OnInit } from '@angular/core';
import { IEmployee } from '../employee/IEmployee';
import { EmployeeService } from '../employee/employee.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-employee',
  templateUrl: './list-employee.component.html',
  styleUrls: ['./list-employee.component.less']
})
export class ListEmployeeComponent implements OnInit {
  employees :IEmployee[];
  constructor( private employeeService : EmployeeService ,
              private router:Router) { }
  
  ngOnInit() {
    this.employeeService.getEmployees().subscribe(
      (listEmployees)=> this.employees= listEmployees,
      (err) => console.log(err)
    );
  }
  editEmployee(employeeId: number){
    this.router.navigate(['/edit',employeeId]);
  }

}
