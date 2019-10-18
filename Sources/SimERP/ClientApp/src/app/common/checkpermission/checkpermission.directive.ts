import {Directive, ElementRef, Input, Renderer2} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenService} from '../../systems/authen.service';

// Xét quyền các button trên UI
@Directive({
  selector: '[appCheckpermission]'
})
export class CheckpermissionDirective {

  // FunctionId of current element
  @Input() functionId: string;


  constructor(private el: ElementRef, private router: Router, private  authenService: AuthenService, private renderer2: Renderer2) {
  }

  // Get current path of component. Ex: /customertype
  getCurrentPath() {
    return this.router.url;
  }

  // hide/show element
  setVisisble(hasPermission: Boolean) {
    this.renderer2.setStyle(this.el.nativeElement, 'display', hasPermission ? '' : 'none');
  }

}
