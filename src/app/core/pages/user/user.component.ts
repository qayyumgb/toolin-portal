import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../shared/services/user.service';
import { userReturnDto } from '../../../constant/models/user.dto';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../../../shared/component/pagination/pagination.component';
import { paginationDto } from '../../../constant/models/tools';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, PaginationComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {
  userList: userReturnDto | undefined
  pagination: paginationDto |null = null
  disablePagination:boolean = false;
  constructor(private userServices: UserService) {

  }
  ngOnInit(): void {
    this.getallUser()

  }
getallUser(offset:number = 0){
  this.disablePagination = true
  this.userServices.getAll(offset).subscribe({
    next: (x: any) => {
      this.userList = x.users
      console.log(x);
      this.disablePagination = false;

      this.pagination = x.users.pagination;

    }
  })
}

  getPageChange(event:number){
    this.getallUser(event)
  }
}
