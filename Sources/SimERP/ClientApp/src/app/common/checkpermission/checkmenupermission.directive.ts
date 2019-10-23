import {Directive, Input, TemplateRef, ViewContainerRef} from '@angular/core';
import {Permissionuser} from '../../systems/permissionuser';
import {AuthenService} from '../../systems/authen.service';
import {Router} from '@angular/router';
import {Key_FunctionId_View} from '../config/globalconfig';

@Directive({
  selector: '[appCheckmenupermission]'
})
export class CheckmenupermissionDirective {
  private isHidden = true;
  functionId = Key_FunctionId_View; // default value
  lstPermission: Permissionuser[] = [];
  controllerName = '';
  arrController: string[] = []; // lưu lại các controller của menu con để phân quyền cho menu cha,
  // chỉ cần 1 menu con có quyền thì sẽ show menu cha

  @Input() set appCheckmenupermission(value) {
    this.controllerName = value;
    this.updateView();
  }

  @Input() set appCheckmenupermissionFn(value) {
    this.functionId = value;
    this.updateView();
  }

  @Input() set appCheckmenupermissionOp(value) {
    this.arrController = value;
    console.log(this.arrController);
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
    let index = -1;
    if (this.arrController.length > 0) {
      let hasPermission = false;
      this.arrController.forEach(controllerName => {
        const i = this.lstPermission.findIndex(value => {
          return value.ControllerName === controllerName && value.FunctionId === Key_FunctionId_View;
        });
        if (i > -1) {
          hasPermission = true;
          return;
        }
      });
      index = hasPermission ? 0 : -1;
    } else {
      index = this.lstPermission.findIndex(value => {
        return value.ControllerName.trim() === this.controllerName && value.FunctionId.trim() === this.functionId.trim();
      });
    }
    return index;
  }
}
