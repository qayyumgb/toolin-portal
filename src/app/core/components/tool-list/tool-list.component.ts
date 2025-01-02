import { Component, OnInit } from '@angular/core';
import { ToolService } from '../../../shared/services/tool.service';
import { toolsDto } from '../../../constant/models/tools';
import { Route, Router, RouterLink } from '@angular/router';
import { RippleModule } from '../../../constant/directive/ripple.directive';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tool-list',
  standalone: true,
  imports: [RouterLink,  RippleModule],
  templateUrl: './tool-list.component.html',
  styleUrl: './tool-list.component.scss'
})
export class ToolListComponent implements OnInit {
  toolList: toolsDto[] | null = null

  constructor(private toolservices: ToolService, private route:Router) {

  }
  ngOnInit(): void {
    this.getAll();
  }
  private getAll() {debugger
    this.toolservices.getAll().subscribe({
      next: (data: any) => {
        this.toolList = data.data
        console.log(this.toolList);
        
        console.log('Received data:', this.toolList);
      },
      error: (err) => {
        console.error('Error:', err);
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
    if (result.isConfirmed) {
      this.toolservices.delete(id).subscribe({
  
        next:(x:any) => {
          Swal.fire({
            icon: "success",
            title: "Your work has been removed",
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
  
}
