import { NgModule } from '@angular/core';
import { RouterModule,Routes} from '@angular/router';
import { ListEmployeeComponent } from './employee/list-employee.component';
import { CreateEmployeeComponent } from './employee/create-employee.component';
import { SearchbarComponent } from './searchbar/searchbar.component';

const appRoutes : Routes=[
{ path:'list',component: ListEmployeeComponent},
{ path:'create',component: CreateEmployeeComponent},
{ path:'edit/:id',component: CreateEmployeeComponent},
{ path:'search',component: SearchbarComponent},
{ path:'', redirectTo:'/list', pathMatch:'full'}

];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],exports:[RouterModule]
})
export class AppRoutingModule { }
