import {Directive, ElementRef, Input, Renderer2, TemplateRef, ViewContainerRef} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenService} from '../../systems/authen.service';
import {Permissionuser} from '../../systems/permissionuser';

// Xét quyền các button trên UI
@Directive({
  selector: '[appCheckpermission]'
})
export class CheckpermissionDirective {

  @Input() set appCheckpermission(value) {
    this.functionId = value;
    this.updateView();
  }

  // FunctionId of current element
  functionId = '';
  controllerName = '';
  private isHidden = true;
  lstPermission: Permissionuser[] = [];

  constructor(private templateRef: TemplateRef<any>, private viewContainer: ViewContainerRef, private el: ElementRef,
              private router: Router, private  authenService: AuthenService, private renderer2: Renderer2) {
    this.authenService.lstPermission.subscribe(res => {
      this.lstPermission = res;
    });
    this.controllerName = this.getCurrentPath();
  }

  updateView() {
    const index = this.checkPermission();
    if (index > -1) {
      if (this.isHidden) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.isHidden = false;
      }
    } else {
      this.isHidden = true;
      this.viewContainer.clear();
    }
  }

  // Get current path of component. Ex: /customertype
  getCurrentPath() {
    const arrURL = this.router.url.split('/');
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

  private checkPermission() {
    let index: number;
    index = this.lstPermission.findIndex(value => {
      return value.ControllerName.trim() === this.controllerName && value.FunctionId.trim() === this.functionId.trim();
    });
    return index;
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
