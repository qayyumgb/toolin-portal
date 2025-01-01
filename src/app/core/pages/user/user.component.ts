import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../shared/services/user.service';
import { userReturnDto } from '../../../constant/models/user.dto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {
  userList: userReturnDto | undefined
  constructor(private userServices: UserService) {

  }
  ngOnInit(): void {
    this.userServices.getAll().subscribe({
      next: (x: any) => {
        this.userList = x.users
        console.log(x);
        
      }
    })
  }
}
