import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class UtilityService {

    constructor() { }

      convertTimestamp (timestamp: { _seconds: number; _nanoseconds: number } |any) : string  {
        const milliseconds = timestamp._seconds * 1000;
        const additionalMilliseconds = timestamp._nanoseconds / 1_000_000;
        const date = new Date(milliseconds + additionalMilliseconds);
        return date.toISOString(); 
      }
    
}