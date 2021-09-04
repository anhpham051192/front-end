import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ValidatorService } from 'src/app/services/validator.service';
import { EmployeeDetailService } from './employee-detail.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.scss']
})
export class EmployeeDetailComponent implements OnInit {
  compId: string;
  empId: string;
  topErrMsg: string;
  topSuccMsg: string;
  topLoadingMsg: string;

  form: FormGroup = this.fb.group({
    compId: [''],
    id: [''],
    firstName: ['', [Validators.required, Validators.maxLength(45)]],
    lastName: ['', [Validators.required, Validators.maxLength(45)]],
    firstNameKana: ['', [Validators.required, Validators.maxLength(45)]],
    lastNameKana: ['', [Validators.required, Validators.maxLength(45)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(45)]],
    dateOfBirth: ['', Validators.required]
  });

  showForm = true;
  mode = 0; // 0:閲覧、1:新規作成、2:編集
  // employeeDto: EmployeeDto;
  f: any;
  checkValid = false

  constructor(
    private service: EmployeeDetailService,
    public msg: MessageService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.url.subscribe(url => {
      if (url[0].path == 'create') {
        this.mode = 1;

        this.route.paramMap.subscribe(params => {
          this.compId = params.get('compId');
          this.form.patchValue({
            compId: this.compId
          });
          if (!ValidatorService.isNumber(this.compId)) {
            this.router.navigate(['/employee']);
          }
        });
      }
      else {
        this.mode = 0;
        if (url[1] != null && url[1].path == 'edit') {
          this.mode = 2;
        }

        this.route.paramMap.subscribe(params => {
          this.empId = params.get('id');
          if (!ValidatorService.isNumber(this.empId)) {
            this.router.navigate(['/employee']);
          }
          else {
            this.initData();
          }
        });
      }
    });

    this.f = this.form.controls;
  }

  initData() {
    // this.employeeDto= new EmployeeDto("Anh","Pham","アン","ファン","pd_anh@asia-hd.com",new Date("1992-02-02"));
    this.service.findById(+this.empId).subscribe((data: any) => {
      this.form.patchValue({
        id: this.empId,
        firstName: (data['firstName'] != null && data['firstName'] != '')
          ? data['firstName'] : '',
        lastName: (data['lastName'] != null && data['lastName'] != '')
          ? data['lastName'] : '',
        firstNameKana: (data['firstNameKana'] != null && data['firstNameKana'] != '')
          ? data['firstNameKana'] : '',
        lastNameKana: (data['lastNameKana'] != null && data['lastNameKana'] != '')
          ? data['lastNameKana'] : '',
        email: (data['email'] != null && data['email'] != '')
          ? data['email'] : '',
        dateOfBirth: (data['dateOfBirth'] != null && data['dateOfBirth'] != '')
          ? data['dateOfBirth'] : '',
      });

    }, (error) => {
      if (error.status != null
        && error.status == 404) {
        this.topErrMsg = MessageService.getMessage(this.msg.MSG_9035);
      }
      else if ((error.status != null
        && error.status == 400)
        || (error.error != null
          && error.error.status != null
          && error.error.status == 400)) {
        this.router.navigate(['/login']);
      }
      else if ((error.status != null
        && error.status == 403)
        || (error.error != null
          && error.error.status != null
          && error.error.status == 403)) {
        this.router.navigate(['/login']);
      }
    });

  }

  //変更ボタンを押す時
  edit() {
    this.mode = 2;
  }

  //保存ボタンを押す時
  save() {
    this.checkValid = true;
    if (!this.form.valid) {
      event.stopPropagation();
    } else {
      this.checkValid = false;
      this.topErrMsg = null;
    }
  }

  onSubmit(event) {
    event.preventDefault();
  }

  onConfirm() {
    this.topLoadingMsg = "処理中...";
    this.showForm = false;

    if (this.mode == 1) {
      this.create();
    } else if (this.mode == 2) {
      this.update();
    }
  }

  create() {
    this.service.create(
      this.form.value
    ).subscribe((data: any) => {
      this.topLoadingMsg = null;
      this.topSuccMsg = MessageService.getMessage(this.msg.MSG_8005);
    }, (error: any) => {
      this.topLoadingMsg = null;
      if ((error.status != null
        && error.status == 400)
        || (error.error != null
          && error.error.status != null
          && error.error.status == 400)) {
        this.router.navigate(['/login']);
      }
      else if ((error.status != null
        && error.status == 403)
        || (error.error != null
          && error.error.status != null
          && error.error.status == 403)) {
        this.router.navigate(['/login']);
      }
      else if ((error.status != null
        && error.status == 500)
        || (error.error != null
          && error.error.status != null
          && error.error.status == 500)) {
        this.topErrMsg = error.error;
      }
    });
  }

  update() {
    this.service.udpate(
      this.form.value
    ).subscribe((data: any) => {
      this.topLoadingMsg = null;
      this.topSuccMsg = MessageService.getMessage(this.msg.MSG_8006);
    }, (error: any) => {
      this.topLoadingMsg = null;
      if ((error.status != null
        && error.status == 400)
        || (error.error != null
          && error.error.status != null
          && error.error.status == 400)) {
        this.router.navigate(['/login']);
      }
      else if ((error.status != null
        && error.status == 403)
        || (error.error != null
          && error.error.status != null
          && error.error.status == 403)) {
        this.router.navigate(['/login']);
      }
      else if ((error.status != null
        && error.status == 500)
        || (error.error != null
          && error.error.status != null
          && error.error.status == 500)) {
        this.topErrMsg = error.error;
      }
    });
  }
}
