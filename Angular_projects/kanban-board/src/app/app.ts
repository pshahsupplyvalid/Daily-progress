import { Component } from '@angular/core';
import { BoardComponent } from './features/board/board';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  imports: [BoardComponent]
})
export class AppComponent {}
