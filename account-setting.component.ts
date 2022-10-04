import { Router } from '@angular/router';
import { AccountService } from './../../../services/account.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-account-setting',
  templateUrl: './account-setting.component.html',
  styleUrls: ['./account-setting.component.css']
})
export class AccountSettingComponent implements OnInit {
  accountSignIn: any;
  getCart:any;
  formGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
    ]),
    address: new FormControl(''),
    email: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-zA-Z_.][a-zA-Z0-9]{0,10}@[a-z0-9]{4,10}\.[a-z]{2,5}$')
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8)
    ]),
    access: new FormControl(false),
    gender: new FormControl('different'),
    telephoneNumber: new FormControl(''),
    cart: new FormControl([]),
    history: new FormControl([])
  })
  constructor(private actService: AccountService, private router: Router) { }

  ngOnInit(): void {
    document.documentElement.scrollTop = 0;
    let openMenuInAccountPages = document.getElementById('openMenuInAccountPages') as HTMLDivElement | null;
    openMenuInAccountPages?.classList.remove('d-none');
    this.accountSignIn = sessionStorage.getItem('accountSignIn');
    this.accountSignIn = JSON.parse(this.accountSignIn);
    if(this.accountSignIn){
      this.actService.getItem(this.accountSignIn.id).subscribe(data => {
        this.formGroup.patchValue(data);
      })
    }
  }
  get account(): any {
    return this.formGroup.controls;
  }
  submitForm() {
    Swal.fire({
      title: 'Do you want to save these edits?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Save',
      denyButtonText: `Don't save`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Swal.fire('Saved!', '', 'success');
        this.actService.editItem(this.accountSignIn.id, this.formGroup.value).subscribe(() => {
          this.router.navigate(['account']);
        })
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info')
        this.router.navigate(['account']);
      }
    })
  }
  check(id: any) {
    this.account.gender.value = id;
  }
  signout(){
    this.actService.isUserLoggedIn.next(false);
    this.actService.totalCard.next(0);
    sessionStorage.clear();
    this.router.navigate(['signin']);
  }
}
