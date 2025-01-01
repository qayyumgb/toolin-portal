import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../../../shared/services/category.service';

@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.scss'
})
export class AddCategoryComponent {
  
  constructor(private fb: FormBuilder,private _service:CategoryService) {
    this.newCategoyrForm = this.fb.group({
      description: ['', Validators.required],
      name: ['', Validators.required],
      image: ['https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D', Validators.required],
   })
  }
  newCategoyrForm: FormGroup ;
  
  
   ngOnInit(): void {
   
   
   }

   addCategory(){
    this._service.create(
      this.newCategoyrForm.get('name')?.value, 
      this.newCategoyrForm.get('image')?.value, 
      this.newCategoyrForm.get('description')?.value, 
    ).subscribe(x =>console.log(x)
   )
   }
}
