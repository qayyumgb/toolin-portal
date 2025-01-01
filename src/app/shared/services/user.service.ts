import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from '../../../environments/environment';
import { userApi } from '../../constant/api/apiEndpoints';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) { }
  getAll(){
    return this.http.get(env.base+userApi.getAll)
  }
}
