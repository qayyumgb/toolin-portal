import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EditorComponentComponent } from '../../../shared/component/editor-component/editor-component.component';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToolService } from '../../../shared/services/tool.service';
import { IDropdownSettings, NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { Router } from '@angular/router';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { UploadService } from '../../../shared/services/upload.service';
import { AlertComponent } from 'ngx-bootstrap/alert';
import { GoogleMapsModule } from '@angular/google-maps';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UtilityService } from '../../../shared/utilities/utility';

@Component({
  selector: 'app-add-tool',
  standalone: true,
  imports: [EditorComponentComponent, NgMultiSelectDropDownModule, CommonModule, ReactiveFormsModule, FormsModule, AngularFireStorageModule, AlertComponent, GoogleMapsModule],
  templateUrl: './add-tool.component.html',
  styleUrl: './add-tool.component.scss'
})
export class AddToolComponent implements OnInit, AfterViewInit {
  // --- Step tracking ---
  formtab: number = 1;
  completedSteps: Set<number> = new Set();
  highestReachedStep: number = 1;

  steps = [
    { id: 1, icon: 'fa-info-circle', name: 'Basic Info', detail: 'Name, brand, model & categories' },
    { id: 2, icon: 'fa-file-alt', name: 'Description & Location', detail: 'Describe the tool and set location' },
    { id: 3, icon: 'fa-camera', name: 'Media', detail: 'Upload tool images' },
    { id: 4, icon: 'fa-money-check-alt', name: 'Pricing & Availability', detail: 'Set pricing and availability options' },
    { id: 5, icon: 'fa-clipboard-check', name: 'Review & Submit', detail: 'Review all details before saving' },
  ];

  // --- Category ---
  dropdownList: any = [];
  selectedCategory: any = [];
  selectedSubCategory: any = [];
  iscategorySelected: boolean = true;
  isSubcategorySelected: boolean = true;
  dropdownSettings: IDropdownSettings = {};
  category: { item_id: any, item_text: any }[] = [];
  subCategory: { item_id: any, item_text: any }[] = [];

  // --- Form state ---
  isLoading: boolean = false;
  isLocationTouched: boolean = false;
  isImageTouch: boolean = false;
  newToolForm: FormGroup;
  toolId: string | null = null;
  isEditForm: boolean = false;

  // --- Location ---
  @ViewChild('addresstext') addresstext!: ElementRef;
  autocomplete: google.maps.places.Autocomplete | undefined;
  autocompleteInitialized: boolean = false;
  lat: any;
  lng: any;

  // --- Image upload ---
  selectedFiles: File[] = [];
  previewUrls: (string | ArrayBuffer | null)[] = [];
  selectedFile!: File;
  uploading: boolean = false;
  isUploadSucess: boolean = false;
  isUploadfailed: boolean = false;

  gettoolSub: any;

  constructor(
    private fb: FormBuilder,
    private getAddFromCord: UtilityService,
    private route: ActivatedRoute,
    private routes: Router,
    private tools: ToolService,
    private uploadService: UploadService,
    private toast: ToastrService
  ) {
    this.newToolForm = this.fb.group({
      id: [''],
      brand: ['', Validators.required],
      categories: [[''], Validators.required],
      subCategories: [[''], Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      images: [[]],
      hasInsurance: [false],
      isAvailable: [true],
      isOperatorAvailable: [false],
      isOwnerApproved: [false],
      marketValue: [''],
      model: ['', Validators.required],
      priceDaily: [0, [Validators.required, Validators.min(1)]],
      priceMonthly: [0, [Validators.required, Validators.min(1)]],
      priceWeekly: [0, [Validators.required, Validators.min(1)]],
      streetAddress: [''],
      _geoloc: [{ lat: 0, lng: 0 }],
      isDeliveryAvailable: [false],
      isPublished: [false],
      availableAfter: [8],
      availableBefore: [18],
      insuranceId: ['12'],
    });
  }

  // ===========================================
  // Step Navigation
  // ===========================================

  isStepCompleted(stepNumber: number): boolean {
    return this.completedSteps.has(stepNumber);
  }

  isStepCurrent(stepNumber: number): boolean {
    return this.formtab === stepNumber;
  }

  isStepClickable(stepNumber: number): boolean {
    return this.completedSteps.has(stepNumber) || stepNumber <= this.highestReachedStep;
  }

  validateStep(step: number): boolean {
    switch (step) {
      case 1: {
        const fields = ['name', 'brand', 'model'];
        fields.forEach(f => this.newToolForm.get(f)?.markAsTouched());
        this.iscategorySelected = this.selectedCategory.length > 0;
        this.isSubcategorySelected = this.selectedSubCategory.length > 0;
        const fieldsValid = fields.every(f => this.newToolForm.get(f)?.valid);
        return fieldsValid && this.selectedCategory.length > 0 && this.selectedSubCategory.length > 0;
      }
      case 2: {
        this.newToolForm.get('description')?.markAsTouched();
        const descValid = this.newToolForm.get('description')?.valid ?? false;
        const locationValid = !!(this.lat && this.lng);
        if (!locationValid) {
          this.isLocationTouched = true;
        }
        return descValid && locationValid;
      }
      case 3: {
        const hasImages = this.previewUrls.length > 0;
        this.isImageTouch = !hasImages;
        return hasImages;
      }
      case 4: {
        const priceFields = ['priceDaily', 'priceWeekly', 'priceMonthly'];
        priceFields.forEach(f => this.newToolForm.get(f)?.markAsTouched());
        return priceFields.every(f => this.newToolForm.get(f)?.valid);
      }
      case 5:
        return true;
      default:
        return true;
    }
  }

  goToStep(targetStep: number): void {
    if (targetStep < 1 || targetStep > 5) return;

    // Going backward: always allowed
    if (targetStep < this.formtab) {
      this.formtab = targetStep;
      return;
    }

    // Going forward: validate all steps between current and target
    for (let s = this.formtab; s < targetStep; s++) {
      if (!this.validateStep(s)) {
        this.formtab = s;
        return;
      }
      this.completedSteps.add(s);
    }

    this.formtab = targetStep;
    if (targetStep > this.highestReachedStep) {
      this.highestReachedStep = targetStep;
    }
  }

  onStepClick(stepNumber: number): void {
    if (this.isStepClickable(stepNumber)) {
      this.goToStep(stepNumber);
    }
  }

  // ===========================================
  // Google Places Autocomplete
  // ===========================================

  ngAfterViewInit(): void {
    this.initAutocomplete();
  }

  private initAutocomplete(): void {
    if (this.autocompleteInitialized) return;
    if (typeof google !== 'undefined' && google.maps?.places && this.addresstext?.nativeElement) {
      this.setupAutocomplete();
    } else {
      // Google Maps script loads async — poll until ready
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if (typeof google !== 'undefined' && google.maps?.places && this.addresstext?.nativeElement) {
          clearInterval(interval);
          this.setupAutocomplete();
        } else if (attempts >= 50) {
          clearInterval(interval);
          console.warn('Google Maps Places API failed to load');
        }
      }, 200);
    }
  }

  private setupAutocomplete(): void {
    if (this.autocompleteInitialized) return;
    const acOptions: google.maps.places.AutocompleteOptions = {
      types: ['geocode', 'establishment'],
      componentRestrictions: { country: 'au' },
      fields: ['geometry', 'formatted_address', 'name']
    };
    this.autocomplete = new google.maps.places.Autocomplete(
      this.addresstext.nativeElement, acOptions
    );
    this.autocomplete.addListener('place_changed', () => {
      const place = this.autocomplete?.getPlace();
      this.newToolForm.patchValue({ streetAddress: place?.formatted_address || place?.name || '' });
      if (place?.geometry) {
        this.getPlaces(place);
        this.isLocationTouched = false;
      } else {
        this.clearLatLng();
      }
    });
    this.addresstext.nativeElement.addEventListener('input', () => {
      if (!this.addresstext.nativeElement.value) {
        this.clearLatLng();
      }
    });
    this.autocompleteInitialized = true;
  }

  clearLatLng(): void {
    this.lat = null;
    this.lng = null;
  }

  getPlaces(place: google.maps.places.PlaceResult): void {
    if (place.geometry && place.geometry.location) {
      this.lat = place.geometry.location.lat();
      this.lng = place.geometry.location.lng();
    } else {
      this.clearLatLng();
    }
  }

  // ===========================================
  // Lifecycle
  // ===========================================

  ngOnInit(): void {
    this.getCategory();

    this.gettoolSub = this.route.paramMap.subscribe(params => {
      this.toolId = params.get('id');
      this.isEditForm = this.route.snapshot.routeConfig?.path?.includes('edit') as any;
      if (this.toolId) {
        this.tools.getbyId(this.toolId).subscribe({
          next: (data: any) => {
            this.selectedCategory = data.categories.map((x: any) => ({
              item_id: x.id,
              item_text: x.name
            }));

            this.newToolForm.patchValue(data);

            // Set lat/lng from stored geolocation
            this.lat = data._geoloc?.lat;
            this.lng = data._geoloc?.lng;
            if (!data.streetAddress && data._geoloc) {
              this.getAddFromCord.getAddressFromCoordinates(data._geoloc.lat, data._geoloc.lng).subscribe({
                next: (address) => {
                  this.newToolForm.patchValue({ streetAddress: address || '' });
                },
                error: (error) => console.error('Error fetching address:', error),
              });
            }

            this.previewUrls = data.images || [];
            this.tools.getCategory().subscribe((x: any[]) => {
              this.category = x.map(c => ({ item_id: c.id, item_text: c.name }));

              if (data.subCategories) {
                this.selectedSubCategory = data.subCategories.map((x: any) => ({
                  item_id: x.id,
                  item_text: x.name
                }));
              }
              this.newToolForm.patchValue({
                subCategories: this.selectedSubCategory.map((x: any) => x.item_id)
              });
              this.getSubcategory();
            });

            // Mark all steps completed for edit mode
            this.completedSteps = new Set([1, 2, 3, 4]);
            this.highestReachedStep = 5;
          },
          error: (error) => {
            console.error('There was an error!', error);
          },
        });
      }
    });

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }

  // ===========================================
  // Category Handlers
  // ===========================================

  getCategory() {
    this.tools.getCategory().subscribe((x: any[]) => {
      this.category = x.map(c => ({ item_id: c.id, item_text: c.name }));
    });
  }

  getSubcategory() {
    const ids = this.selectedCategory.map((x: any) => x.item_id).join();
    this.tools.getSubCategory(ids).subscribe((x: any[]) => {
      this.subCategory = x.map(c => ({ item_id: c.id, item_text: c.name }));
      const subCategoryIds = new Set(this.subCategory.map((z: any) => z.item_id));
      this.selectedSubCategory = this.selectedSubCategory.filter((x: any) => subCategoryIds.has(x.item_id));
    });
  }

  onItemSelect(item: any) {
    if (!this.selectedCategory.some((x: any) => x.item_id === item.item_id)) {
      this.selectedCategory.push(item);
    }
    this.newToolForm.patchValue({
      categories: this.selectedCategory.map((x: any) => x.item_id)
    });
    this.iscategorySelected = this.selectedCategory.length > 0;
    this.getSubcategory();
  }

  onSubCatSelect(item: any) {
    if (!this.selectedSubCategory.some((x: any) => x.item_id === item.item_id)) {
      this.selectedSubCategory.push(item);
    }
    this.newToolForm.patchValue({
      subCategories: this.selectedSubCategory.map((x: any) => x.item_id)
    });
    this.isSubcategorySelected = this.selectedSubCategory.length > 0;
  }

  onSelectAll(items: any, iscategory: boolean = true) {
    if (iscategory) {
      this.selectedCategory = items;
      this.newToolForm.patchValue({
        categories: this.selectedCategory.map((x: any) => x.item_id)
      });
      this.iscategorySelected = this.selectedCategory.length > 0;
    } else {
      this.selectedSubCategory = items;
      this.newToolForm.patchValue({
        subCategories: this.selectedSubCategory.map((x: any) => x.item_id)
      });
      this.isSubcategorySelected = this.selectedSubCategory.length > 0;
    }
  }

  onItemDeSelect(item: any) {
    this.selectedCategory = this.selectedCategory.filter((x: any) => x.item_id !== item.item_id);
    this.newToolForm.patchValue({
      categories: this.selectedCategory.map((x: any) => x.item_id)
    });
    this.getSubcategory();
    this.iscategorySelected = this.selectedCategory.length > 0;
  }

  onSubCateDeSelect(item: any) {
    this.selectedSubCategory = this.selectedSubCategory.filter((x: any) => x.item_id !== item.item_id);
    this.newToolForm.patchValue({
      subCategories: this.selectedSubCategory.map((x: any) => x.item_id)
    });
    this.isSubcategorySelected = this.selectedSubCategory.length > 0;
  }

  // ===========================================
  // Description Editor
  // ===========================================

  getModal(e: any) {
    const x = document.createElement('div');
    x.innerHTML = e;
    const data = x.innerText;
    if (data === '') {
      this.newToolForm.patchValue({ description: null });
    } else {
      this.newToolForm.patchValue({ description: e });
    }
  }

  // ===========================================
  // Image Upload
  // ===========================================

  removeImage(index: number) {
    const imageUrl = this.previewUrls[index];
    this.previewUrls.splice(index, 1);
    if (imageUrl && typeof imageUrl === 'string') {
      this.uploadService.deleteFile(imageUrl);
    }
    if (this.previewUrls.length === 0) {
      this.completedSteps.delete(3);
    }
  }

  onFileChange(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.uploading = true;
      this.selectedFiles = Array.from(fileInput.files);
      this.isLoading = true;

      this.uploadService.uploadImages(this.selectedFiles, 'uploads')
        .then((urls) => {
          this.previewUrls = [...this.previewUrls, ...urls];
          this.uploading = false;
          this.isUploadSucess = true;
          this.isUploadfailed = false;
          this.isLoading = false;
        },
        (err) => {
          console.error('Error uploading files:', err);
          this.uploading = false;
          this.isUploadfailed = true;
          this.isUploadSucess = false;
          this.isLoading = false;
        });
    }
  }

  // ===========================================
  // Submit
  // ===========================================

  AddToolHandler() {
    // Validate all steps before submit
    for (let s = 1; s <= 4; s++) {
      if (!this.validateStep(s)) {
        this.goToStep(s);
        this.toast.error('Please complete all required fields.', 'Validation Error');
        return;
      }
    }

    this.newToolForm.patchValue({
      images: this.previewUrls,
      _geoloc: { lat: this.lat ?? 0, lng: this.lng ?? 0 },
      categories: this.selectedCategory.map((x: any) => ({ id: x.item_id, name: x.item_text })),
      subCategories: this.selectedSubCategory.map((x: any) => ({ id: x.item_id, name: x.item_text })),
    });

    this.isLoading = true;
    if (this.newToolForm.get('id')?.value == null || this.newToolForm.get('id')?.value === '') {
      this.newToolForm.removeControl('id');
      this.tools.add(this.newToolForm.value).subscribe({
        next: () => {
          this.toast.success('Tool successfully added');
          this.routes.navigate(['/tools']);
        },
        error: (error) => {
          this.isLoading = false;
          this.toast.error(error?.message || 'Failed to add tool', 'Error');
          console.error('There was an error!', error);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      this.tools.update(this.newToolForm.get('id')?.value, this.newToolForm.value).subscribe({
        next: () => {
          this.toast.success('Tool successfully updated');
          this.routes.navigate(['/tools']);
        },
        error: (error) => {
          this.isLoading = false;
          this.toast.error(error?.message || 'Failed to update tool', 'Error');
          console.error('There was an error!', error);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }
}
