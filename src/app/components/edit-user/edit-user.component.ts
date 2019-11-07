import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {APIService, UserModel} from '../../services/api.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {

  user: UserModel;

  userLoading: boolean = false;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly apiService: APIService,
    private readonly dialog: MatDialog,
    private readonly snackbar: MatSnackBar
  ) {
  }

  async ngOnInit() {
    this.getUser();
  }

  public getUser = async () => {
    const userId = this.activatedRoute.snapshot.paramMap.get('user');
    try {
      this.user = await this.apiService.getUser(userId);
    } catch (e) {
      this.snackbar.open('Failed to get user (' + e + ')')._dismissAfter(2000);
    }
  };

  public addTag = async () => {
    this.userLoading = true;
    const dialogRef = this.dialog.open(AddTagDialogComponent, {
      data: {
        tag: ''
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        this.userLoading = false;
        return;
      }

      this.apiService.addTag(this.user._id, result).then(() => {
        this.userLoading = false;
        this.getUser();
      }).catch(e => {
        this.snackbar.open('Failed to add tag (' + e + ')')._dismissAfter(2000);
        this.userLoading = false;
      });
    });
  };

  public giveAdmin = async () => {
    this.userLoading = true;
    try {
      await this.apiService.giveAdmin(this.user._id);
      await this.getUser();
      this.userLoading = true;
    } catch (e) {
      this.snackbar.open('Failed to give admin (' + e + ')')._dismissAfter(2000);
      this.userLoading = false;
    }
  };

  public removeAdmin = async () => {
    this.userLoading = true;
    try {
      await this.apiService.removeAdmin(this.user._id);
      await this.getUser();
      this.userLoading = true;
    } catch (e) {
      this.snackbar.open('Failed to remove admin (' + e + ')')._dismissAfter(2000);
      this.userLoading = false;
    }
  };

  public removeTag = async () => {
    this.userLoading = true;
    const dialogRef = this.dialog.open(RemoveTagDialogComponent, {
      data: {
        tag: ''
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        this.userLoading = false;
        return;
      }

      this.apiService.removeTag(this.user._id, result).then(() => {
        this.userLoading = false;
        this.getUser();
      }).catch(e => {
        this.snackbar.open('Failed to remove tag (' + e + ')')._dismissAfter(2000);
        this.userLoading = false;
      });
    });
  };
}

export interface TagDialogData {
  tag: string;
}

@Component({
  selector: 'app-remove-tag',
  templateUrl: 'removeTag.dialog.component.html',
})
export class RemoveTagDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<RemoveTagDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TagDialogData) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-add-tag',
  templateUrl: 'addTag.dialog.component.html',
})
export class AddTagDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<AddTagDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TagDialogData) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
