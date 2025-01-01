import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../../../../shared/services/category.service';
import { categoryDto } from '../../../../constant/models/category.dto';
import { CommonModule } from '@angular/common';
import { RippleModule } from '../../../../constant/directive/ripple.directive';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [RouterLink, CommonModule, RippleModule],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss'
})
export class CategoryListComponent implements OnInit {
categoryList:categoryDto[] = []
constructor(private categoryService : CategoryService) {
  
}
  ngOnInit(): void {
    this.getAll();
  }

  delete(data:any){
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert "+data.name+"!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove it!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoryService.delete(data.id).subscribe({
    
          next:(x:any) => {
            Swal.fire({
              icon: "success",
              title: data.name+" Your work has been removed",
              showConfirmButton: false,
              timer: 1500
            });
            console.log(x);
            
            this.getAll();
  
          }
        })
       
      }
    });
  
    
  
  }
  
  getAll() {
    this.categoryService.getAll().subscribe({
      next: (response: any) => {
        console.log(response);
        this.categoryList = response?.data || [];
      },
      error: (err: any) => {
        console.error('Error fetching categories', err);
      }
    });
  }
}