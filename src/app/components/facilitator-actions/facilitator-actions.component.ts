import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {EventModel} from '../../services/api.service';

export interface FacilitatorActionsDialogData {
  event: EventModel;
}


@Component({
  selector: 'app-facilitator-actions',
  templateUrl: 'facilitator-actions.dialog.component.html',
})
export class FacilitatorActionsDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<FacilitatorActionsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FacilitatorActionsDialogData) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
