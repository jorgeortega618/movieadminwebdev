import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header class="p-4 bg-blue-600 text-white">
      <h1 class="text-2xl">Catálogo de Películas</h1>
    </header>
  `,
  styles: [`
    header {
      height: 64px;
      display: flex;
      align-items: center;
    }
  `]
})
export class HeaderComponent {
  title = 'Catálogo de Películas';
}