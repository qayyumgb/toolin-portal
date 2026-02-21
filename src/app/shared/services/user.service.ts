import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { getFirestore } from './firebase-init';

const PAGE_SIZE = 10;

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private get db() { return getFirestore(); }

  getAll(page: number = 1): Observable<any> {
    if (page < 1) page = 1;
    return from(
      this.db.collection('users').where('deletedAt', '==', null).get()
    ).pipe(
      map(snapshot => {
        const allDocs = snapshot.docs
          .map(doc => ({ ...doc.data(), id: doc.id }))
          .sort((a: any, b: any) => {
            const aTime = a.createdAt?.seconds || a.createdAt?._seconds || 0;
            const bTime = b.createdAt?.seconds || b.createdAt?._seconds || 0;
            return bTime - aTime;
          });

        const totalCount = allDocs.length;
        const totalPages = Math.ceil(totalCount / PAGE_SIZE);
        const start = (page - 1) * PAGE_SIZE;
        const data = allDocs.slice(start, start + PAGE_SIZE);

        return {
          users: {
            data,
            pagination: {
              count: totalCount,
              limit: PAGE_SIZE,
              offset: page,
              totalPages,
            },
          },
        };
      })
    );
  }
}
