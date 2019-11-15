import {Component, OnInit} from '@angular/core';
import {APIService, UserModel} from '../../services/api.service';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss'],
})
export class ManageUsersComponent implements OnInit {
  users: Array<UserModel>;
  usersSource: Array<UserModel>;

  constructor(
    private readonly apiService: APIService
  ) {
  }

  async ngOnInit() {
    await this.getUsers();
    console.log(this.usersSource);
  }

  public getUsers = async () => {
    this.users = await this.apiService.getUsers();
    this.usersSource = this.users; // UsersSource is something can be filtered, etc
  };

  public applyFilter = (filter: string) => {
    if (filter) {
      this.usersSource = this.users.filter(
        candidate => candidate.fullName.toLowerCase().includes(filter.toLowerCase()) ||
          candidate._id.includes(filter)
      );
    } else {
      this.usersSource = this.users;
    }
  };
}
