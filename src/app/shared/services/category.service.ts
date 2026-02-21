import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { getFirestore, firebase } from './firebase-init';

const PAGE_SIZE = 10;

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private get db() { return getFirestore(); }

  getById(id: string): Observable<any> {
    return from(this.db.collection('categories').doc(id).get()).pipe(
      map(doc => {
        if (!doc.exists) return null;
        return { ...doc.data(), id: doc.id };
      })
    );
  }

  getAll(page: number = 1): Observable<any> {
    if (page < 1) page = 1;
    return from(this.db.collection('categories').get()).pipe(
      map(snapshot => {
        const allDocs = snapshot.docs
          .map(doc => ({ ...doc.data(), id: doc.id }))
          .sort((a: any, b: any) => {
            const aTime = a.createdOn?.seconds || a.createdOn?._seconds || 0;
            const bTime = b.createdOn?.seconds || b.createdOn?._seconds || 0;
            return bTime - aTime;
          });

        const totalCount = allDocs.length;
        const totalPages = Math.ceil(totalCount / PAGE_SIZE);
        const start = (page - 1) * PAGE_SIZE;
        const data = allDocs.slice(start, start + PAGE_SIZE);

        return {
          data,
          pagination: {
            count: totalCount,
            limit: PAGE_SIZE,
            offset: page,
            totalPages,
          },
        };
      })
    );
  }

  create(data: any): Observable<any> {
    const docData = {
      ...data,
      createdOn: firebase.firestore.FieldValue.serverTimestamp(),
      updatedOn: firebase.firestore.FieldValue.serverTimestamp(),
      parentId: data.parentId || null,
    };
    return from(this.db.collection('categories').add(docData)).pipe(
      map(ref => ({ id: ref.id, ...docData }))
    );
  }

  update(id: string, data: any): Observable<any> {
    const docData = {
      ...data,
      updatedOn: firebase.firestore.FieldValue.serverTimestamp(),
    };
    return from(this.db.collection('categories').doc(id).update(docData)).pipe(
      map(() => ({ id, ...docData }))
    );
  }

  delete(id: string): Observable<any> {
    return from(this.db.collection('categories').doc(id).delete());
  }
}
