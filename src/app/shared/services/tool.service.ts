import { Injectable } from '@angular/core';
import { env } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { toolsEndpoints } from '../../constant/api/apiEndpoints';
import { toolsDto } from '../../constant/models/tools';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ToolService {
  base: string = env.base;

  constructor(private http: HttpClient) {
  
  }

  getCategory(): Observable<any[]> {
    return this.http.get<any[]>(this.base + toolsEndpoints.categories);
  }
  getSubCategory(id:any): Observable<any[]> {
    return this.http.get<any[]>(this.base + toolsEndpoints.subCategories+id);
  }
  add(tool: toolsDto): Observable<toolsDto> {
    return this.http.post<toolsDto>(this.base + toolsEndpoints.getAll, tool);
  }
update(id:any,tool: toolsDto): Observable<toolsDto> {
    return this.http.patch<toolsDto>(this.base + toolsEndpoints.getAll+"/"+id, tool);
  }
  getAll(offset:any =0): Observable<toolsDto[]> {
    return this.http.get<toolsDto[]>(this.base + toolsEndpoints.getToolList+"?limit=10&offset="+offset);
  }
  getbyId(Id:any): Observable<toolsDto> {
    return this.http.get<toolsDto>(this.base + toolsEndpoints.getAll+"/"+Id);
  }
  delete(Id:any) {
    return this.http.delete(this.base + toolsEndpoints.getAll+"/"+Id);
  }
}
