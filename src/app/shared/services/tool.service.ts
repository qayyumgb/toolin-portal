import { Injectable } from '@angular/core';
import { Observable, from, of, combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { getFirestore, firebase, waitForAuth } from './firebase-init';

@Injectable({
  providedIn: 'root',
})
export class ToolService {
  private pageSize = 10;
  private get db() { return getFirestore(); }

  private getProfile(): any {
    try {
      return JSON.parse(localStorage.getItem('proifleDetail') || '{}');
    } catch { return {}; }
  }

  getAll(page: number = 1): Observable<any> {
    if (page < 1) page = 1;
    const profile = this.getProfile();
    const userUid = profile.uid || profile.id;
    let query: any = this.db.collection('tools').where('deletedAt', '==', null);
    if (profile.role !== 'Admin' && userUid) {
      query = query.where('owner.uid', '==', userUid);
    }
    return from(query.get()).pipe(
      map((snapshot: any) => {
        const allDocs = snapshot.docs
          .map((doc: any) => ({ ...doc.data(), id: doc.id }))
          .sort((a: any, b: any) => {
            const aTime = a.createdOn?.seconds || a.createdOn?._seconds || 0;
            const bTime = b.createdOn?.seconds || b.createdOn?._seconds || 0;
            return bTime - aTime;
          });

        const totalCount = allDocs.length;
        const totalPages = Math.ceil(totalCount / this.pageSize);
        const start = (page - 1) * this.pageSize;
        const data = allDocs.slice(start, start + this.pageSize);

        return {
          data,
          pagination: {
            count: totalCount,
            limit: this.pageSize,
            offset: page,
            totalPages,
          },
        };
      })
    );
  }

  getbyId(id: string): Observable<any> {
    return from(this.db.collection('tools').doc(id).get()).pipe(
      map(doc => {
        if (!doc.exists) return null;
        return { ...doc.data(), id: doc.id };
      })
    );
  }

  add(tool: any): Observable<any> {
    return from(waitForAuth()).pipe(
      switchMap((currentUser) => {
        const profile = this.getProfile();
        const ownerUid = currentUser?.uid || profile.uid || profile.id;
        const data = {
          ...tool,
          ownerId: ownerUid,
          owner: {
            uid: ownerUid,
            email: currentUser?.email || profile.email || '',
            firstName: profile.firstName || '',
            lastName: profile.lastName || '',
          },
          createdOn: firebase.firestore.FieldValue.serverTimestamp(),
          updatedOn: firebase.firestore.FieldValue.serverTimestamp(),
          deletedAt: null,
        };
        return from(this.db.collection('tools').add(data)).pipe(
          map(ref => ({ id: ref.id, ...data }))
        );
      })
    );
  }

  update(id: string, tool: any): Observable<any> {
    return from(waitForAuth()).pipe(
      switchMap(() => {
        const data = { ...tool };
        delete data.id;
        data.updatedOn = firebase.firestore.FieldValue.serverTimestamp();
        return from(this.db.collection('tools').doc(id).update(data)).pipe(
          map(() => ({ id, ...data }))
        );
      })
    );
  }

  delete(id: string): Observable<any> {
    return from(waitForAuth()).pipe(
      switchMap(() =>
        from(this.db.collection('tools').doc(id).update({
          deletedAt: firebase.firestore.FieldValue.serverTimestamp(),
        }))
      )
    );
  }

  getCategory(): Observable<any[]> {
    return from(
      this.db.collection('categories').where('parentId', '==', null).get()
    ).pipe(
      map(snapshot =>
        snapshot.docs
          .map(doc => ({ ...doc.data(), id: doc.id }))
          .sort((a: any, b: any) => (a.name || '').localeCompare(b.name || ''))
      )
    );
  }

  getSubCategory(ids: string): Observable<any[]> {
    const idArray = ids.split(',').filter(id => id.trim());
    if (idArray.length === 0) return of([]);

    const queries = idArray.map(parentId =>
      from(
        this.db.collection('categories').where('parentId', '==', parentId.trim()).get()
      ).pipe(
        map(snapshot =>
          snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
        )
      )
    );

    return combineLatest(queries).pipe(
      map(results =>
        results.flat().sort((a: any, b: any) => (a.name || '').localeCompare(b.name || ''))
      )
    );
  }
}
