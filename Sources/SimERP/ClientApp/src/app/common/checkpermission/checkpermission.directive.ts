import {Directive, ElementRef, Input, Renderer2, TemplateRef, ViewContainerRef} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenService} from '../../systems/authen.service';
import {Permissionuser} from '../../systems/permissionuser';

// Xét quyền các button trên UI
@Directive({
  selector: '[appCheckpermission]'
})
export class CheckpermissionDirective {
  lstFunctionId: string[] = []; // danh sách các function cần xét của control
  controllerName = ''; // url đang xét
  private isHidden = true;
  lstPermissionUser: Permissionuser[] = []; // danh sách các permission của user hiện tại

  // đầu vào là array các functionId
  @Input() set appCheckpermission(value) {
    this.lstFunctionId = value;
    this.updateView();
  }

  constructor(private templateRef: TemplateRef<any>, private viewContainer: ViewContainerRef, private el: ElementRef,
              private router: Router, private  authenService: AuthenService, private renderer2: Renderer2) {
    this.authenService.lstPermission.subscribe(res => {
      this.lstPermissionUser = res;
    });
    this.controllerName = this.getCurrentPath();
  }

  updateView() {
    const isHasPermission = this.checkPermission();
    if (isHasPermission) {
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

  // function kiểm tra người dùng có quyền trên element
  private checkPermission(): boolean {
    let index = -1; // xác định có tìm thấy quyền của element trong danh sách quyền của người dùng
    let isHasAllRight = false; // mặc định ban đầu không có quyền
    // duyệt qua danh sách quyền của element
    isHasAllRight = this.lstFunctionId.every(functionId => {
      // lấy ra chỉ số quyền của element trong danh sách quyền của người dùng
      index = this.lstPermissionUser.findIndex(permission => {
        return functionId.trim() === permission.FunctionId.trim() && this.controllerName.trim() === permission.ControllerName.trim();
      });
      // nếu tồn tại 1 mã quyền không nằm trong danh sách người dùng
      if (index < 0) {
        // kết thúc quá trình kiểm tra => kết luận không có quyền trên element
        return false;
      }
      // nếu đã duyệt qua tất cả các quyền trên element => kết luận có quyền
      return true;
    });
    return isHasAllRight;
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
