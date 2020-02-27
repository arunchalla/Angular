import { NgModule } from '@angular/core';
import { MatButtonModule,
  MatButtonToggleModule,
  MatInputModule,
  MatIconModule,
  MatRadioModule } from '@angular/material';

const materialComponents = [MatButtonModule, MatButtonToggleModule,MatInputModule,MatIconModule, MatRadioModule];

@NgModule({
  
  imports: [materialComponents],
  exports:[materialComponents]
})
export class MaterialModule { }
