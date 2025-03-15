import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  constructor() { }

  private showFullNavbar = new BehaviorSubject<boolean >(true);
  state$ = this.showFullNavbar.asObservable(); 
  private itsMobile = new BehaviorSubject<boolean >(false);
  state2$ = this.itsMobile.asObservable(); 

  fullNavbar(newState: boolean) {
    this.showFullNavbar.next(newState);
  }
  showInMobile(newState: boolean) {
    this.itsMobile.next(newState);
  }

  isFullNavbar():Observable<boolean> {
    return this.showFullNavbar; // Access the current value
  }
  getIsMobiel():Observable<boolean> {
    return this.itsMobile;
  }
}
