import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{
  title = 'pokemon-indexes-app';

  constructor(private router: Router) { }
  ngOnInit()  { }

  goToMainPage() {
    this.router.navigateByUrl('');
  }
}
