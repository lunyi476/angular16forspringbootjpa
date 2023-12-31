import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
//import { MsgDialogData } from './msg-dialog-data';


/**
 * @author: lyi
 * 08/2020
 */
@Component({
    selector: 'deletedialog-component',
    templateUrl: './deletedialog.component.html',
    styleUrls: ['./deletedialog.component.css'],
    standalone: true,
    imports: [MatDialogModule] 
})
export class DeletedialogComponent implements OnInit {

    constructor( public dialogRef: MatDialogRef<DeletedialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {

    }
        
    ngOnInit(){
    }

    delete(): void {
        this.dialogRef.close(true);
    }

    cancel(): void {
        this.dialogRef.close(false);
    }
}