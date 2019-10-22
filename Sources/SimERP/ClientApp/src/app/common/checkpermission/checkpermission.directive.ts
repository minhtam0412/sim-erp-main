import {Directive, ElementRef, Input, Renderer2} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenService} from '../../systems/authen.service';
import {Permissionuser} from '../../systems/permissionuser';

// Xét quyền các button trên UI
@Directive({
  selector: '[appCheckpermission]'
})
export class CheckpermissionDirective {

  // FunctionId of current element
  @Input() functionId: string;

  lstPermission: Permissionuser[] = [];


  constructor(private el: ElementRef, private router: Router, private  authenService: AuthenService, private renderer2: Renderer2) {
    this.authenService.lstPermission.subscribe(res => {
      this.lstPermission = res;
    });
    console.log(this.getCurrentPath());
  }

  // Get current path of component. Ex: /customertype
  getCurrentPath() {
    const arrURL = this.router.url.split('/');
    console.log(arrURL);
    if (arrURL && arrURL.length > 0) {
      const filter = arrURL.filter((value) => {
        return value != null && value.length > 0;
      });
      if (filter && filter.length > 0) {
        return filter[0];
      }
    }
    return null;
  }


  // hide/show element
  setVisisble(hasPermission: Boolean) {
    this.renderer2.setStyle(this.el.nativeElement, 'display', hasPermission ? '' : 'none');
  }

  setEnable(hasPermission: boolean) {
    if (hasPermission) {
      this.renderer2.removeAttribute(this.el.nativeElement, 'disabled');
    } else {
      this.renderer2.setAttribute(this.el.nativeElement, 'disabled', '');
    }
  }

}
