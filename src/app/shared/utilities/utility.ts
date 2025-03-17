import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor() { }

  convertTimestamp(timestamp: { _seconds: number; _nanoseconds: number } | any): string {
    const milliseconds = timestamp._seconds * 1000;
    const additionalMilliseconds = timestamp._nanoseconds / 1_000_000;
    const date = new Date(milliseconds + additionalMilliseconds);
    return date.toISOString();
  }




  getAddressFromCoordinates(lat: number, lng: number): Observable<string | null> {
    return new Observable((observer) => {
      const geocoder = new google.maps.Geocoder();
      const latlng = new google.maps.LatLng(lat, lng);

      geocoder.geocode({ location: latlng }, (results:any, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          if (results[0]) {
            observer.next(results[0].formatted_address);
          } else {
            console.error("No address found.");
            observer.next(null);
          }
        } else {
          console.error("Geocoder failed due to: " + status);
          observer.error(status);
        }
        observer.complete();
      });
    });
  }

}
