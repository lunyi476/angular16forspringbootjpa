import { Injectable} from '@angular/core';
import { MsgdialogComponent} from './dialogs/msgdialog.component';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { DeletedialogComponent } from './dialogs/deletedialog.component';


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

  add(message: string) {
    this.messages.push(message);
  }

  constructor ( public dialog: MatDialog) {  }

  clear() {
    this.messages = [];
  }


  openDialog(respMessage: string): void {
    this.dialogRef = this.dialog.open(MsgdialogComponent,  
    {
      panelClass: 'dialog-panel',
      data: { message: respMessage}
    });


    this.dialogRef.afterClosed().subscribe(res => {
      respMessage = '';
    });
  }

  openDelDialog(respMessage: string): MatDialog {
       return this.dialog;
  }

}
