import { Routes } from '@angular/router';
import { QuizComponent_Refinance } from './components/pages/quiz-refinance';
import { QuizComponent_Purchase } from './components/pages/quiz-purchase';
import { HomepageComponent } from './components/pages/homepage';
export const routes: Routes = [
  {
    path: 'refinance',
    component: QuizComponent_Refinance,
    title: 'Refinance your home | Joseph Longobardi',
  },
  {
    path: 'purchase',
    component: QuizComponent_Purchase,
    title: 'Purchase a new home | Joseph Longobardi',
  },
  {
    path: '',
    component: HomepageComponent,
    title: 'Expert Mortgage Advisor | Joseph Longobardi',
  },
  {
    path: '**',
    redirectTo: 'homepage',
  },
];
