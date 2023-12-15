import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
//import { MsgDialogData} from './msg-dialog-data';

/**
 * @author: lyi
 * 08/2020
 */
@Component({
    selector: 'app-msgdialog',
    templateUrl: './msgdialog.component.html',
    styleUrls: ['./msgdialog.component.css'],
    standalone: true,
    imports: [MatDialogModule]
})
export class MsgdialogComponent implements OnInit {

  constructor(  public dialogRef: MatDialogRef<MsgdialogComponent> , @Inject(MAT_DIALOG_DATA)  public data: any
              ) { }

  onClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}
