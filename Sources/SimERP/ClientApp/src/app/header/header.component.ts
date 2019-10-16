import {Component, OnInit} from '@angular/core';
import {AuthenService} from '../systems/authen.service';
import {User} from '../systems/user';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ChangepasswordComponent} from '../systems/changepassword/changepassword.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  sessionUser: User;

  constructor(private authenService: AuthenService, private ngbModal: NgbModal) {
    this.authenService.currentUser.subscribe(x => {
      this.sessionUser = x;
    });
  }

  ngOnInit() {
  }

  logout() {
    this.authenService.logout();
  }

  changePassworDialog() {
    const modalRef = this.ngbModal.open(ChangepasswordComponent, {
      backdrop: 'static', scrollable: true, centered: true, backdropClass: 'backdrop-modal'
    });
  }
}
