import {Directive, Input, TemplateRef, ViewContainerRef} from '@angular/core';
import {Permissionuser} from '../../systems/permissionuser';
import {AuthenService} from '../../systems/authen.service';
import {Router} from '@angular/router';

@Directive({
  selector: '[appCheckmenupermission]'
})
export class CheckmenupermissionDirective {
  private isHidden = true;
  functionId = ''; // default value
  lstPermission: Permissionuser[] = [];
  controllerName = '';

  @Input() set appCheckmenupermission(value) {
    this.controllerName = value;
    this.updateView();
  }

  @Input() set appCheckmenupermissionFn(value) {
    this.functionId = value;
    this.updateView();
  }


  constructor(private templateRef: TemplateRef<any>, private viewContainer: ViewContainerRef, private  authenService: AuthenService,
              private router: Router) {
    this.authenService.lstPermission.subscribe(res => {
      this.lstPermission = res;
    });
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

  private checkPermission() {
    const index = this.lstPermission.findIndex(value => {
      return value.ControllerName.trim() === this.controllerName && value.FunctionId.trim() === this.functionId.trim();
    });
    return index;
  }
}
