import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from './service.base';
import { env } from '../../../environments/environment';
import { categoriesApi } from '../../constant/api/apiEndpoints';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http:HttpClient) { }
  getById(id: string) {
    return this.http.get(env.base+categoriesApi.getbyId+id)
  }
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(env.base+categoriesApi.getAll)
  }
  create(data:any) {
    return this.http.post(env.base+categoriesApi.create, data)
  }
  update(id:string,data: any) {
    return this.http.patch(env.base+categoriesApi.getbyId+id, data)
  }
  delete(data: any) {
    return this.http.delete(env.base+categoriesApi.getbyId+data)
  }

  
}
