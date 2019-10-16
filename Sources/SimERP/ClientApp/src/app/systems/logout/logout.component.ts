import {Component, OnInit} from '@angular/core';
import {AuthenService} from '../authen.service';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(private authenService: AuthenService, private loadingSpinnerService: Ng4LoadingSpinnerService) {
  }

  ngOnInit() {
    console.log('Logout');
    this.authenService.logout();
  }
}
