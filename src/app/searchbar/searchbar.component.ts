import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.less']
})
export class SearchbarComponent implements OnInit {
  items: string[] = ['Winter', 'Spring'];
  seasonType:string;
  private selectedLink: string="Winter"; 
  constructor() { }

  ngOnInit() {
    this.seasonType = this.items[1];
}
public seasonChanged(event){
  //console.log("changes", event && event.value);
};
public isSelected(name :string){
  if(!this.selectedLink){
    return false;
  }
  return (this.selectedLink === name)
}
}
