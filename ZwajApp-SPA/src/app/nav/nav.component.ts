import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { error } from 'protractor';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model :any={};
  constructor( private authService: AuthService) { }

  ngOnInit() {
  }
  login(){

    this.authService.login(this.model).subscribe(
      next=>{console.log('connexion réussi')},
      error=>{console.log('connexion pas réussi')}
    )
  }
  loggedIn(){

    const token = localStorage.getItem('token');
    return !! token 
  }
  loggedOut(){

    localStorage.removeItem('token');
    console.log("vous etes déconnecter")
  }

}
