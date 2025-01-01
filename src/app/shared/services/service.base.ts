import { Observable } from "rxjs";

export interface BaseService {
    getById(id: string):Observable<any>;
    getAll(): Observable<any[]>;
    create(name:string, image:string, description:string):any ;
    update(data:any):any ;
    delete(data:any):any ;
}