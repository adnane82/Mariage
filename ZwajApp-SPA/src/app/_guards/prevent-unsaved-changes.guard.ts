import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanDeactivate } from '@angular/router';

import { MemberEditComponent } from '../members/member-edit/member-edit.component';
import { AlertifyService, ConfirmResult } from '../_services/alertify.service';
import { createOfflineCompileUrlResolver } from '@angular/compiler';
import { Observable, of } from 'rxjs';
import { t } from '@angular/core/src/render3';

@Injectable({
  providedIn: 'root'
})
export class PreventUnsavedChangesGuard implements CanDeactivate<MemberEditComponent> {
  x = false;
  constructor(private alertify: AlertifyService) { }

  async canDeactivate(component: MemberEditComponent) {

    if (component.editForm.dirty) {

      const confirm = await this.alertify.promisifyConfirm('Attention', 'Tu viens de faire des modification!!!Veux tu continuer');
      if (confirm == ConfirmResult.Ok) { this.x = true } else {
        this.x = false;
      }
      
      return this.x;

    }
    return true
  }

  // checkGuard(){
  //   var x=of(false);
  //   var y =false;
  //   var m =false;

  //  this.alertify.confirm('تم تعديل البيانات الخاصة بك هل تود الإستمرار بدون حفظ البيانات',
  //   function(){x.subscribe(data=>y=!data);x=of(y);x.subscribe(t=>m=t)}) 
  //   console.log(m);
  //  return x;


  // }



}
