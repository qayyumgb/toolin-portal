import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../../../shared/services/category.service';
import { UploadService } from '../../../../shared/services/upload.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.scss'
})
export class AddCategoryComponent {

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private _service: CategoryService, private uploadService: UploadService, private toast: ToastrService) {
    this.newCategoyrForm = this.fb.group({
      id: [null],
      description: ['', Validators.required],
      name: [''],
      imageLink: ["", Validators.required],
      image: [''],
    })
  }
  newCategoyrForm: FormGroup;
  categoryid: string | null = null

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      this.categoryid = params.get('id');
      this.categoryid && this.getbyId(this.categoryid)
    })
  }
  selectedFiles: File[] = [];
  previewUrls: string | null = null;
  selectedFile!: File;
  onFileChange(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFiles = Array.from(fileInput.files);
      this.uploadService.uploadImages(this.selectedFiles, 'uploads')
        .then((urls) => {
          this.previewUrls = urls[0];
          this.newCategoyrForm.patchValue({
            imageLink: urls[0]
          })
          console.log('Uploaded URLs:', this.previewUrls);
        },
          (err) => {
            console.error('Error uploading files:', err);
          }
        );
    }
  }
  getbyId(id: string) {
    this._service.getById(id).subscribe({
      next: (x: any) => {
        console.log(x);
        this.previewUrls = x.image
        this.newCategoyrForm.patchValue({
          id: x.id,
          name: x.name,
          description: x.description,
          imageLink: x.image
        })

      }
    })
  }
  addCategory() {
    if (this.newCategoyrForm.valid) {
      debugger
      if (this.newCategoyrForm.get("id")?.value == null) {
        this._service.create(
          this.newCategoyrForm.get('name')?.value,
           this.newCategoyrForm.get('imageLink')?.value,
          this.newCategoyrForm.get('description')?.value,
        ).subscribe({
          next: x => {
            console.log(x)
            this.toast.success("Category is successfully added")
            this.router.navigate(['/cateogry'])
          }
        }
        )
      }
      else {
        this._service.update(
          this.newCategoyrForm.get('id')?.value,
          {
            name: this.newCategoyrForm.get('name')?.value,
            image: this.previewUrls || this.newCategoyrForm.get('imageLink')?.value,
            description: this.newCategoyrForm.get('description')?.value,
          }
        ).subscribe({
          next: x => {
            console.log(x)
            this.toast.success("Category is successfully Updated")
            this.router.navigate(['/cateogry'])
          }
        }
        )
      }

    }
  }
}
