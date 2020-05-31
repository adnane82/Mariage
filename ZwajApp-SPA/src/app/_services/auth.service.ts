import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from "rxjs/operators";
import { JwtHelperService } from "@auth0/angular-jwt";
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { BehaviorSubject } from 'rxjs';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  jwtHelper = new JwtHelperService();

  baseUrl = environment.apiUrl + 'auth/';
  decodedToken: any;
  currentUser: User;
  paid:boolean=false;
  photoUrl = new BehaviorSubject<string>('../../assets/User.jpg');
  currentPhotoUrl = this.photoUrl.asObservable();
  unreadCount = new BehaviorSubject<string>('');
  latestUnreadCount = this.unreadCount.asObservable();
  hubConnection :HubConnection = new HubConnectionBuilder().withUrl("http://localhost:5000/chat").build();

  constructor(private http: HttpClient) { }
  changeMemberPhoto(newPhotoUrl) {

    this.photoUrl.next(newPhotoUrl);
  }
  login(model: any) {
    return this.http.post(this.baseUrl + 'login', model).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          localStorage.setItem('user', JSON.stringify(user.user))
          localStorage.setItem('token', user.token);
          this.decodedToken = this.jwtHelper.decodeToken(user.token);
          this.currentUser = user.user;
          this.changeMemberPhoto(this.currentUser.photoURL);

        }
      }))
  }
  register(user: User) {
    return this.http.post(this.baseUrl +'register', user);

  }
  loggedIn() {
    try {

      const token = localStorage.getItem('token');
      return !this.jwtHelper.isTokenExpired(token);
    }
    catch {
      return false;
    }


  }

}
