import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from '../../../environments/environment';
import { orderApi, paymentApi } from '../../constant/api/apiEndpoints';
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
  getById(Id:any):Observable<any>{
    return this.http.get<any>(env.base+orderApi.getOrder+"/"+Id)
  }
  paymentApi(Id:any):Observable<any>{
    return this.http.get<any>(env.base+paymentApi.payment+Id)
  }
}
