import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {APIService, UserModel} from '../../services/api.service';
import {MatChipInputEvent, MatDialog, MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {

  user: UserModel;
  userLoading = false;

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
      this.snackbar.open(e)._dismissAfter(2000);
    }
  };

  public addTag = async (event: MatChipInputEvent) => {
    this.userLoading = true;
    try {
      await this.apiService.addTag(this.user._id, event.value);
      await this.getUser();
    } catch (e) {
      this.snackbar.open(e)._dismissAfter(2000);
    }
    this.userLoading = false;
    event.input.value = '';
  };

  public giveAdmin = async () => {
    this.userLoading = true;
    try {
      await this.apiService.giveAdmin(this.user._id);
      await this.getUser();
      this.userLoading = true;
    } catch (e) {
      this.snackbar.open(e)._dismissAfter(2000);
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
      this.snackbar.open(e)._dismissAfter(2000);
      this.userLoading = false;
    }
  };

  public removeTag = async (tag: string) => {
    this.userLoading = true;
    try {
      await this.apiService.removeTag(this.user._id, tag);
      await this.getUser();
    } catch (e) {
      this.snackbar.open(e)._dismissAfter(2000);
    }
    this.userLoading = false;
  };
}
