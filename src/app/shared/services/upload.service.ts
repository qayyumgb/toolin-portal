import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  constructor(private storage: AngularFireStorage) {}


  uploadImages(fileArray: File[], path: string): Promise<string[]> {debugger
    const uploadPromises = fileArray.map((file) => this.uploadImage(file, path));
    return Promise.all(uploadPromises);
  }
  
  private uploadImage(file: File, path: string): Promise<string> {
    const filePath = `${path}/${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, file);
  
    return new Promise<string>((resolve, reject) => {
      uploadTask.snapshotChanges().pipe(finalize(() =>{
        fileRef.getDownloadURL().subscribe({
          next: (url) => resolve(url),
          error: (err) => reject(err),
        });
      }) as any).subscribe({
        next: (snapshot) => {
          console.log('snapshot', snapshot)
        },
        error: (err) => reject(err),
      });
      // const subscription = uploadTask.snapshotChanges().subscribe({
      //   next: () => {
      //     // When the upload completes, get the download URL
      //     fileRef.getDownloadURL().subscribe({
      //       next: (url) => {
      //         resolve(url);
      //         subscription.unsubscribe(); // Cleanup subscription
      //       },
      //       error: (err) => {
      //         reject(err);
      //         subscription.unsubscribe(); // Cleanup subscription
      //       },
      //     });
      //   },
      //   error: (err) => {
      //     reject(err);
      //     subscription.unsubscribe(); // Cleanup subscription
      //   },
      // });
    });
  }
  
  deleteFile(filePath: string): Promise<void> {
    const fileRef = this.storage.ref(filePath);
    return fileRef.delete().toPromise();
  }
}
