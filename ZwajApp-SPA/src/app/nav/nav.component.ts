import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { error } from 'protractor';
import { AlertifyService } from '../_services/alertify.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model :any={};
  photoUrl:string;
  constructor( public authService: AuthService, private alertify:AlertifyService,private router:Router) { }

  ngOnInit() {
    this.authService.currentPhotoUrl.subscribe(
      photourl=>this.photoUrl=photourl
    );
  }
  login(){

    this.authService.login(this.model).subscribe(
      next=>{this.alertify.success('connexion réussi')},
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
