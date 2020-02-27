import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors, FormArray } from '@angular/forms';
import { CustomValidator } from '../shared/custom.validator';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../employee/employee.service';
import { IEmployee } from '../employee/IEmployee';
import { Iskill } from '../employee/Iskill';
import { Router } from '@angular/router';


@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.less']
})
export class CreateEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  employee: IEmployee;
  validationMessages = {
    'fullname': {
      'required': 'Fullname is required',
      'maxlenth': 'Fullname must be lessthan 250 characters',
      'minlength': ' Fullname must be greaterthan 2 characters'
    },
    'email': {
      'required': 'Email is required',
      'emailDomain': 'Email domain should be gmail.com'
    },
    'confirmEmail': {
      'required': 'Confirm Email is required'
    },
    'emailGroup': {
      'emailMisMatch': 'Confirm email does not match'
    },
    'phone': {
      'required': 'Phone is required'
    },
  }
  formError = {

  };

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private empService: EmployeeService,
    private router : Router) { }

  ngOnInit() {
    this.employeeForm = this.fb.group({
      fullname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(256)]],
      ContactPreferense: ['email'],
      emailGroup: this.fb.group({
        email: ['', [Validators.required, CustomValidator.emailDomain('gmail.com')]],
        confirmEmail: ['', Validators.required],
      }, { validator: matchEmail }),
      phone: [''],
      skills: this.fb.array([
        this.addSkillsFormGroup()
      ])
    });

    this.employeeForm.get('ContactPreferense').valueChanges.subscribe((data: string) => {
      this.onPrefChange(data);
    });
    this.employeeForm.valueChanges.subscribe((data: any) => {
      this.logValidationErrors(this.employeeForm);
    });
    this.route.paramMap.subscribe(params => {
      const empId = +params.get('id');
      if (empId) {
        this.getEmployeeDetails(empId);
      }
    })
  }
  getEmployeeDetails(id: number) {
    this.empService.getEmployee(id).subscribe(
      (employee: IEmployee) => {
        this.editEmployee(employee);
        this.employee = employee;
      },
      (err: any) => console.log(err)
    );
  }
  editEmployee(employee: IEmployee) {
    this.employeeForm.patchValue({
      fullname: employee.fullname,
      ContactPreferense: employee.contactpreference,
      emailGroup: {
        email: employee.email,
        confirmEmail: employee.email,
      },
      phone: employee.phone
    });
    this.employeeForm.setControl('skills', this.setExistingSkills(employee.skills));
  }
  setExistingSkills(skillSets: Iskill[]): FormArray {
    const formArray = new FormArray([]);
    skillSets.forEach(s => {
      formArray.push(this.fb.group({
        skillName: s.skillName,
        experience: s.experience,
        proficiency: s.proficency

      }));
    });
    return formArray;
  }
  addSkillButton(): void {
    (<FormArray>this.employeeForm.get('skills')).push(this.addSkillsFormGroup());
  }
  addSkillsFormGroup() {
    return this.fb.group({
      skillName: ['', [Validators.required]],
      experience: ['', [Validators.required]],
      proficiency: ['', [Validators.required]]
    })
  }
  onSubmit(): void {
    this.mapFormValuesToModel();
    this.empService.updateEmployee(this.employee).subscribe(
      ()=>this.router.navigate(['list']),
      (err :any)=>console.log(err)
    );
  }
  mapFormValuesToModel(){
    this.employee.fullname = this.employeeForm.value.fullname;
    this.employee.contactpreference = this.employeeForm.value.contactpreference;
    this.employee.email = this.employeeForm.value.email;
    this.employee.phone = this.employeeForm.value.phone;
    this.employee.skills = this.employeeForm.value.skills;
  }

  onPrefChange(selectedValue: string) {
    const phoneControl = this.employeeForm.get('phone');
    if (selectedValue === 'phone') {
      phoneControl.setValidators(Validators.required);
    } else {
      phoneControl.clearValidators();
    }
    phoneControl.updateValueAndValidity();
  }

  logValidationErrors(group: FormGroup = this.employeeForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractFormControl = group.get(key); //here the key is formcontrol or formgroup
      this.formError[key] = '';
      if (abstractFormControl && !abstractFormControl.valid &&
        (abstractFormControl.touched || abstractFormControl.dirty || abstractFormControl.value !== '')) {
        const messages = this.validationMessages[key];
        for (const errorKey in abstractFormControl.errors) {
          if (errorKey) {
            this.formError[key] += messages[errorKey] + '';
          }
        }
      }
      if (abstractFormControl instanceof FormGroup) {
        //recursively call the method to loop through the nested formgroups
        this.logValidationErrors(abstractFormControl);
      }
    });

  }

  onLoadData(): void {
    // this.logValidationErrors(this.employeeForm);
    // console.log(this.formError);
    const formArray1 = this.fb.array([
      new FormControl('arun', Validators.required),
      new FormControl('IT', Validators.required),
      new FormControl('Male', Validators.required),
    ]);
    const formGroup = this.fb.group([
      new FormControl('arun', Validators.required),
      new FormControl('IT', Validators.required),
      new FormControl('Male', Validators.required),
    ]);
    console.log(formArray1);
    console.log(formGroup);
  };
  removeSkill(skillGroupIndex: number): void {
    const skillsFormArray = (<FormArray>this.employeeForm.get('skills'))
    skillsFormArray.removeAt(skillGroupIndex);
    skillsFormArray.markAsDirty();
    skillsFormArray.markAsTouched();
  }
}

function matchEmail(group: AbstractControl): { [key: string]: any } | null {
  const emailControl = group.get('email');
  const confirmEmailControl = group.get('confirmEmail');

  if (emailControl.value === confirmEmailControl.value || (confirmEmailControl.pristine && confirmEmailControl.value === '')) {
    return null;

  } else {
    return { 'emailMisMatch': true };
  }
}


