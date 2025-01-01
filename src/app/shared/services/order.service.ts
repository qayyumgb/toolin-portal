import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from '../../../environments/environment';
import { orderApi } from '../../constant/api/apiEndpoints';
import { Observable } from 'rxjs';
import { orderReturnDto } from '../../constant/models/order.dto';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http:HttpClient) { }

  getAll():Observable<orderReturnDto>{
    return this.http.get<orderReturnDto>(env.base+orderApi.getAll)
  }
}
