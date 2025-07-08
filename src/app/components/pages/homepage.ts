import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatCardTitle } from '@angular/material/card';

/**
 * Homepage component that serves as the landing page for the application.
 * It provides options for users to choose between purchasing a new home or refinancing an existing one.
 */

@Component({
  selector: 'app-homepage',
  imports: [RouterLink, MatButtonModule, MatCard, MatCardTitle],
  template: ` <div class="homepage">
    <h1>Finding the Right Loan Just Got Easier</h1>
    <p>
      Looking to find the best mortgage option for your situation? Whether you're buying a new home or refinancing your current one, I'm here to guide
      you every step of the way. Let's get started — what type of mortgage are you looking for?
    </p>
    <!-- <button
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
    </button> -->

    <div class="homepage-decision card-grid">
      <mat-card
        class="quiz-card"
        routerLink="/purchase">
        <img
          mat-card-image
          src="/purchase-home.png"
          alt="Purchase a new home" />
        <mat-card-title>Home Buying</mat-card-title>
      </mat-card>
      <mat-card
        class="quiz-card"
        routerLink="/refinance">
        <img
          mat-card-image
          src="/refinance-home.png"
          alt="Refinance a new home" />
        <mat-card-title>Refinance</mat-card-title>
      </mat-card>
    </div>
  </div>`,
})
export class HomepageComponent {}
