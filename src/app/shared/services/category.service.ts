import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from './service.base';
import { env } from '../../../environments/environment';
import { categoriesApi } from '../../constant/api/apiEndpoints';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService implements BaseService{

  constructor(private http:HttpClient) { }
  getById(id: string) {
    return this.http.get(env.base+categoriesApi.getbyId+id)
  }
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(env.base+categoriesApi.getAll)
  }
  create(name:string, image:string, description:string) {
    return this.http.post(env.base+categoriesApi.create+`?name=${image}&image=${image}&description=${description}`, null)
  }
  update(data: any) {
    return this.http.patch(env.base+categoriesApi.getbyId, data)
  }
  delete(data: any) {
    return this.http.delete(env.base+categoriesApi.getbyId+data)
  }

  
}
