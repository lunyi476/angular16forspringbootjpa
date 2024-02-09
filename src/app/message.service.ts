import { Injectable, inject, EnvironmentInjector, runInInjectionContext }  from '@angular/core';
import { MsgdialogComponent} from './dialogs/msgdialog.component';
import { MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DeletedialogComponent } from './dialogs/deletedialog.component';
//import { LoginComponent } from './login/login.component';


/**
 * @author: lyi
 * 08/2020
 */
 @Injectable({
  providedIn: 'root'
}) 
export class MessageService {

  messages: string[] =[]; 
  dialogRef: MatDialogRef<MsgdialogComponent>;
  deleteDialogRef: MatDialogRef<DeletedialogComponent>;
  private environmentInjector = inject(EnvironmentInjector);
  dialog: MatDialog;

  add(message: string) {
    this.messages.push(message);
  }

  constructor ( ) { // (public dialog: MatDialog) // MatDialog provided in bootStrapApplication
    runInInjectionContext(this.environmentInjector, () => {
      this.dialog = inject(MatDialog); // Do what you need with the injected service
    });
  }

  clear() {
    this.messages = [];
  }


  openDialog(respMessage: string): void {  // , loginA?: LoginComponent

    this.dialogRef = this.dialog.open(MsgdialogComponent,  
    //  const dialogConfig = new MatDialogConfig();
    {
      panelClass: 'dialog-panel',
      data: { message: respMessage}
    });

    //if (loginA != null) { // testing only
      //this will update DOM Element because ControlForm having ElementRef
      //loginA.registrationForm.get("userName").setValue("ABCDF");
    //}

    this.dialogRef.afterClosed().subscribe(res => {
      respMessage = '';
    });
  }

  openDelDialog(respMessage: string): MatDialog {
       return this.dialog;
  }

}
