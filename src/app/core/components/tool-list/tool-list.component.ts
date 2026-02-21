import { Component, OnInit } from '@angular/core';
import { ToolService } from '../../../shared/services/tool.service';
import { paginationDto, toolsDto } from '../../../constant/models/tools';
import { Router, RouterLink } from '@angular/router';
import { RippleModule } from '../../../constant/directive/ripple.directive';
import Swal from 'sweetalert2';
import { PaginationComponent } from '../../../shared/component/pagination/pagination.component';
import { NoDataFound } from '../../../shared/component/no-data-found/no-data-found.component';

@Component({
  selector: 'app-tool-list',
  standalone: true,
  imports: [RouterLink,  RippleModule, PaginationComponent,NoDataFound],
  templateUrl: './tool-list.component.html',
  styleUrl: './tool-list.component.scss'
})
export class ToolListComponent implements OnInit {
  toolList: toolsDto[] | null = null
  pagination:paginationDto ={
    count:0,
    limit:0,
    offset:0,
    totalPages:0
  }
  constructor(private toolservices: ToolService, private route:Router) {

  }
  ngOnInit(): void {
    this.getAll();
  }
  private getAll(page:any = 0) {
    this.toolservices.getAll(page).subscribe({
      next: (data: any) => {
        this.toolList = data.data
        this.pagination = data.pagination
      },
      error: (err) => {
      },
    })
  }
  showModal: boolean = true;
  showModalHandling() {
    this.route.navigate(['tools/add'])
  }
delete(id:any){
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, remove it!"
  }).then((result) => {
    if (result.isConfirmed) {this.delete
      this.toolservices.delete(id).subscribe({
        next:(x:any) => {
          Swal.fire({
            icon: "success",
            title: "Your work has been removed",
            showConfirmButton: false,
            timer: 1500
          });
          this.getAll();

        }
      })
     
    }
  });

  

}
getPageChange(e:any){
this.getAll(e);

}
}
