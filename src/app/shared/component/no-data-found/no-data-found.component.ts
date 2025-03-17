import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-no-data-found',
  standalone: true,
  imports: [],
  template: `
     <div class="no-data-found px-5 pt-5 d-flex flex-column justify-content-center align-items-center w-100">
     <img src="img/nodatafound.png" alt="">
     <h6 class="text-center mb-0">{{title}}</h6>
     @if(detail){
      <p class="text-center fs-9 mb-2 text-lighter">
       {{detail}}
    </p>
     }
 </div>
  `,
  styles: `
  .no-data-found{
    img{
      width:150px;
    }
  }
  `
})
export class NoDataFound {
@Input() detail :string | boolean = false;
@Input() title :string | boolean = "Data not found";
}
