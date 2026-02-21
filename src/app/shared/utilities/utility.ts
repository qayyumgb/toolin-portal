import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor() { }

  convertTimestamp(timestamp: any): string {
    if (!timestamp) return '';
    if (timestamp.toDate) return timestamp.toDate().toISOString();
    const seconds = timestamp._seconds ?? timestamp.seconds ?? 0;
    const nanoseconds = timestamp._nanoseconds ?? timestamp.nanoseconds ?? 0;
    const date = new Date(seconds * 1000 + nanoseconds / 1_000_000);
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
