import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { error } from 'protractor';
import { AlertifyService } from '../_services/alertify.service';
import { Router } from '@angular/router';
import { UserService } from '../_services/user.service';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model :any={};
  photoUrl:string;
  count:string;
  hubConnection:HubConnection;
  constructor( private userService :UserService    ,public authService: AuthService, private alertify:AlertifyService,private router:Router) { }

  ngOnInit() {
    this.authService.currentPhotoUrl.subscribe(
      photourl=>this.photoUrl=photourl
    );
    this.userService.getUnreadCount(this.authService.decodedToken.nameid).subscribe(
      res=>{this.authService.unreadCount.next(res.toString());
      this.authService.latestUnreadCount.subscribe(res=>{this.count=res;});
      });
      this.hubConnection = new HubConnectionBuilder().withUrl("http://localhost:5000/chat").build();
      this.hubConnection.start();
      this.hubConnection.on('count', () => {
        setTimeout(() => {
              this.userService.getUnreadCount(this.authService.decodedToken.nameid).subscribe(res=>{
                this.authService.unreadCount.next(res.toString());
                this.authService.latestUnreadCount.subscribe(res=>{this.count=res;});
                     });
            }, 0);
    });
  }
  login(){

    this.authService.login(this.model).subscribe(
      next=>{this.alertify.success('connexion réussi');  this.userService.getUnreadCount(this.authService.decodedToken.nameid).subscribe(res=>{
        this.authService.unreadCount.next(res.toString());
        this.authService.latestUnreadCount.subscribe(res=>{this.count=res;});
    
             });	 },
      error=>{this.alertify.error('pas autorisé')},
      ()=>{this.router.navigate(['/members']);}
    )
  }
  loggedIn(){

    
    return this.authService.loggedIn();
  }
  loggedOut(){

    localStorage.removeItem('token');
    this.authService.decodedToken=null;
    localStorage.removeItem('user');
    this.authService.currentUser=null;
    this.alertify.message("vous etes déconnecter");
    this.router.navigate(['home']);
  }

}
