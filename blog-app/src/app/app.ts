import { Component, signal } from '@angular/core';
import { Header } from './ui/components/header/header';
import { Footer } from './ui/components/footer/footer';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  
}
