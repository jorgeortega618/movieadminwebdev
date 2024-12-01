import { Component } from '@angular/core';

@Component({
  selector: 'app-welcome',
  standalone: true,
  template: `
    <section class="p-4">
      <h2 class="text-xl mb-4">Welcome to {{ name }}!</h2>
      <a 
        class="text-blue-600 hover:text-blue-800 underline"
        target="_blank" 
        href="https://angular.dev/overview">
        Learn more about Angular
      </a>
    </section>
  `,
})
export class WelcomeComponent {
  name = 'Angular';
}