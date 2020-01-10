import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { error } from 'protractor';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model :any={};
  constructor( public authService: AuthService, private alertify:AlertifyService) { }

  ngOnInit() {
  }
  login(){

    this.authService.login(this.model).subscribe(
      next=>{this.alertify.success('connexion réussi')},
      error=>{this.alertify.error('pas autorisé')}
    )
  }
  loggedIn(){

    
    return this.authService.loggedIn();
  }
  loggedOut(){

    localStorage.removeItem('token');
    this.alertify.message("vous etes déconnecter")
  }

}
