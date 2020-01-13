import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  registerMode : boolean=false; 
 

  constructor(private http:HttpClient,private authService:AuthService,private router:Router) { }

  ngOnInit() {
    if (this.authService.loggedIn){
      this.router.navigate([''])
    }
   
  }
  registerToggle(){

    this.registerMode=true;
  }
  
  cancelRegister(mode :boolean){

    this.registerMode=mode;
  }

}