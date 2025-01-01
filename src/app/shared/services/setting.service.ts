import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  constructor() { }

  private showFullNavbar = new BehaviorSubject<boolean>(true);
  state$ = this.showFullNavbar.asObservable(); // Expose as an Observable

  fullNavbar(newState: boolean) {
    this.showFullNavbar.next(newState);
  }

  isFullNavbar():Observable<boolean> {
    return this.showFullNavbar; // Access the current value
  }
}
