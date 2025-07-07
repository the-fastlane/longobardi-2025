import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-homepage',
  imports: [RouterLink, MatButtonModule],
  template: ` <div class="homepage">
    <h1>Finding the Right Loan Just Got Easier</h1>
    <p>
      Looking to find the best mortgage option for your situation? Whether you're buying a new home or refinancing your current one, I'm here to guide
      you every step of the way. Let's get started — what type of mortgage are you looking for?
    </p>
    <button
      matButton="filled"
      class="quiz-option"
      routerLink="/purchase">
      Purchase
    </button>
    &nbsp;
    <button
      matButton="filled"
      class="quiz-option"
      routerLink="/refinance">
      Refinance
    </button>
  </div>`,
})
export class HomepageComponent {}
