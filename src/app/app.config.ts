import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import {
  provideRouter,
  withViewTransitions,
  withInMemoryScrolling,
  InMemoryScrollingOptions,
} from '@angular/router';

import { routes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';

import {
  provideAnimations,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';

import {
  provideHttpClient,
  withInterceptorsFromDi,
  withFetch,
} from '@angular/common/http';

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const scrollConfig: InMemoryScrollingOptions = {
  scrollPositionRestoration: 'enabled',
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(
      routes,
      withViewTransitions(),
      withInMemoryScrolling(scrollConfig)
    ),
    provideClientHydration(withEventReplay()),
    prefersReducedMotion ? NoopAnimationsModule : provideAnimations(),
    provideHttpClient(withInterceptorsFromDi(), withFetch()),
  ],
};
