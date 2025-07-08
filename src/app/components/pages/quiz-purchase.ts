import { Component, signal, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlider } from '@angular/material/slider';
import { MatSliderModule } from '@angular/material/slider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QuizStep } from '../models/quiz.model';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-quiz-purchase',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatButton,
    MatFormFieldModule,
    MatInputModule,
    MatSlider,
    MatSliderModule,
    MatProgressBarModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  animations: [
    trigger('fadeStep', [
      transition(':increment', [style({ opacity: 0 }), animate('200ms ease-in', style({ opacity: 1 }))]),
      transition(':decrement', [style({ opacity: 0 }), animate('200ms ease-in', style({ opacity: 1 }))]),
    ]),
  ],
  template: `<div class="s-container">
    <mat-progress-bar
      mode="determinate"
      [value]="progressPercentage"
      color="primary"></mat-progress-bar>
    <div
      class="quiz-container"
      [@fadeStep]="currentStepIndex()">
      <div [innerHTML]="currentStep.html"></div>
      <h2>{{ currentStep.question }}</h2>

      <!-- SLIDER TYPE -->
      @if (currentStep.type === 'slider') {
        <div class="slider-step step">
          <div class="slider-value">
            @if (+slider.value === currentStep.sliderConfig?.min) {
              {{ slider.value | currency: 'USD' : 'symbol' : '1.0-0' }} or less
            } @else if (+slider.value === currentStep.sliderConfig?.max) {
              {{ slider.value | currency: 'USD' : 'symbol' : '1.0-0' }} or more
            } @else {
              {{ slider.value | currency: 'USD' : 'symbol' : '1.0-0' }} -
              {{ addNumbers(+slider.value, currentStep.sliderConfig?.step ?? 0) | currency: 'USD' : 'symbol' : '1.0-0' }}
            }
          </div>
          <mat-slider
            [min]="currentStep.sliderConfig?.min"
            [max]="currentStep.sliderConfig?.max"
            [step]="currentStep.sliderConfig?.step"
            thumbLabel
            ><input
              matSliderThumb
              [value]="currentValue ? currentValue : currentStep.sliderConfig?.defaultValue"
              #slider
          /></mat-slider>
          <div class="slider-labels">
            <span>
              {{ currentStep.sliderConfig?.min | currency: 'USD' : 'symbol' : '1.0-0' }}
            </span>
            <span> {{ currentStep.sliderConfig?.max | currency: 'USD' : 'symbol' : '1.0-0' }}+ </span>
          </div>
          <div class="button-row">
            @if (currentStepIndex() > 0) {
              <button
                mat-button
                color="accent"
                (click)="previousStep()">
                ← Back
              </button>
            }
            <button
              mat-raised-button
              color="primary"
              (click)="submitInput(slider.value)">
              Next
            </button>
          </div>
        </div>
      }

      <!-- RANGE TYPE -->
      @if (currentStep.type === 'range') {
        <div class="slider-step step">
          <div class="slider-value">
            {{ sliderMin.value | currency: 'USD' : 'symbol' : '1.0-0' }} -
            {{ sliderMax.value | currency: 'USD' : 'symbol' : '1.0-0' }}
          </div>
          <mat-slider
            [min]="currentStep.sliderConfig?.min"
            [max]="currentStep.sliderConfig?.max"
            [step]="currentStep.sliderConfig?.step"
            thumbLabel>
            <input
              matSliderStartThumb
              [value]="currentRangeValues[0] ? currentRangeValues[0] : currentStep.sliderConfig?.min"
              #sliderMin />
            <input
              matSliderEndThumb
              [value]="currentRangeValues[1] ? currentRangeValues[1] : currentStep.sliderConfig?.defaultValue"
              #sliderMax />
          </mat-slider>
          <div class="slider-labels">
            <span>
              {{ currentStep.sliderConfig?.min | currency: 'USD' : 'symbol' : '1.0-0' }}
            </span>
            <span> {{ currentStep.sliderConfig?.max | currency: 'USD' : 'symbol' : '1.0-0' }}+ </span>
          </div>
          <div class="button-row">
            @if (currentStepIndex() > 0) {
              <button
                mat-button
                color="accent"
                (click)="previousStep()">
                ← Back
              </button>
            }
            <button
              mat-raised-button
              color="primary"
              (click)="submitInputRange([sliderMin.value, sliderMax.value])">
              Next
            </button>
          </div>
        </div>
      }

      <!-- RESULTS TYPE -->
      @if (currentStep.type === 'results') {
        <div class="results-step step">
          <pre>{{ formData | json }}</pre>
          <button
            mat-raised-button
            color="primary"
            (click)="previousStep()">
            ← Back
          </button>
        </div>
      }

      <!-- CARD TYPE -->
      @if (currentStep.type === 'cards') {
        <div class="step">
          <div class="card-grid card-grid-purchase">
            @for (card of currentStep.cards; track card) {
              <mat-card
                class="quiz-card"
                (click)="selectOption(card.value)">
                <img
                  mat-card-image
                  [src]="card.imageUrl"
                  alt="{{ card.title }}" />
                <mat-card-title>{{ card.title }}</mat-card-title>
              </mat-card>
            }
          </div>
          @if (currentStepIndex() > 0) {
            <div>
              <button
                mat-button
                color="accent"
                (click)="previousStep()">
                ← Back
              </button>
            </div>
          }
        </div>
      }

      <!-- INFO TYPE -->
      @if (currentStep.type === 'info') {
        <div class="info-step step">
          <button
            mat-raised-button
            color="primary"
            (click)="nextStep()">
            Continue
          </button>
          <br /><br />
          @if (currentStepIndex() > 0) {
            <div>
              <button
                mat-button
                color="accent"
                (click)="previousStep()">
                ← Back
              </button>
            </div>
          }
        </div>
      }

      <!-- BUTTON TYPE -->
      @if (currentStep.type === 'buttons') {
        <div class="buttons-grid step">
          @for (option of currentStep.options; track option) {
            <button
              matButton="filled"
              (click)="selectOption(option)"
              class="quiz-option">
              {{ option }}
            </button>
          }
          @if (currentStepIndex() > 0) {
            <div>
              <button
                mat-button
                color="accent"
                (click)="previousStep()">
                ← Back
              </button>
            </div>
          }
        </div>
      }

      <!-- INPUT TYPE -->
      @if (currentStep.type === 'input') {
        <div class="quiz-input step">
          <mat-form-field
            appearance="outline"
            class="full-width">
            <mat-label>{{ currentStep.label ?? currentStep.question }}</mat-label>
            <input
              matInput
              required
              [type]="currentStep.inputType || 'text'"
              [attr.maxlength]="currentStep.maxLength"
              #inputEl
              [formControl]="currentStep.formKey === 'email' ? emailFormControl : noFormControl"
              (keyup.enter)="submitInput(inputEl.value)"
              [value]="formData[currentStep.formKey] ?? ''" />
            @if (emailFormControl.hasError('email') && !emailFormControl.hasError('required')) {
              <mat-error>Please enter a valid email address</mat-error>
            }
            @if (noFormControl.hasError('required')) {
              <mat-error>This field is required</mat-error>
            }
          </mat-form-field>
          <button
            mat-raised-button
            color="primary"
            (click)="submitInput(inputEl.value)">
            Next
          </button>
          @if (currentStepIndex() > 0) {
            <div>
              <button
                mat-button
                color="accent"
                (click)="previousStep()">
                ← Back
              </button>
            </div>
          }
        </div>
      }
    </div>
  </div>`,
})
export class QuizComponent_Purchase implements AfterViewInit {
  currentStepIndex = signal(0);
  formData: Record<any, any> = {};

  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  noFormControl = new FormControl('', [Validators.required]);
  @ViewChild('inputEl') inputElRef!: ElementRef<HTMLInputElement>;

  steps: QuizStep[] = [
    {
      type: 'cards',
      question: 'What are you looking to purchase?',
      formKey: 'homeType',
      cards: [
        {
          title: 'Single Family',
          imageUrl: 'single-family-home.png',
          value: 'Single Family',
        },
        {
          title: 'Condominium',
          imageUrl: 'condominium.png',
          value: 'Condominium',
        },
        {
          title: 'Townhouse',
          imageUrl: 'townhome.png',
          value: 'Townhouse',
        },
        {
          title: '2nd Home',
          imageUrl: '2nd-home.png',
          value: '2nd Home',
        },
        {
          title: 'Investment Property',
          imageUrl: 'multi-family-home.png',
          value: 'Investment Property',
        },
      ],
    },
    {
      type: 'buttons',
      question: 'Are you a first time home buyer?',
      options: ['Yes', 'No'],
      formKey: 'firstTimeHomeBuyer',
    },

    {
      type: 'buttons',
      question: 'Are you a military veteran or eligible for VA financing?',
      options: ['Yes', 'No'],
      formKey: 'militaryVeteran',
    },
    {
      type: 'range',
      question: 'What is your purchase price range?',
      formKey: 'purcasePriceRange',
      sliderConfig: {
        min: 200000,
        max: 2000000,
        step: 20000,
        defaultValue: 400000,
        unit: '$',
      },
    },
    {
      type: 'range',
      question: 'What is your downpayment range?',
      formKey: 'downpaymentRange',
      sliderConfig: {
        min: 20000,
        max: 400000,
        step: 20000,
        defaultValue: 200000,
        unit: '$',
      },
    },
    {
      type: 'buttons',
      question: 'Are you currently working with a realtor?',
      options: ['Yes', 'No'],
      formKey: 'realtorStatus',
    },
    {
      type: 'input',
      question: 'What is your full name?',
      inputType: 'text',
      formKey: 'name',
      label: 'Full Name',
    },
    {
      type: 'input',
      question: 'What is your email address?',
      inputType: 'email',
      formKey: 'email',
      label: 'Email Address',
    },
    {
      type: 'input',
      question: 'Phone number',
      inputType: 'tel',
      formKey: 'phone',
    },
    {
      type: 'results',
      question: '',
      formKey: 'results',
      html: `<h1>You did it!</h1>
            <p>We will review your information and get back to you shortly with personalized options.</p>
            <p>If you have any questions, feel free to reach out to us at <a href="tel:410-960-7639">410-960-7639</a>.</p>`,
    },
  ];

  constructor(private snackBar: MatSnackBar) {}

  ngAfterViewInit() {}

  get visibleSteps() {
    return this.steps.filter((step) => {
      if (!step.condition) return true;

      const answer = this.formData[step.condition.dependsOn];
      const expected = step.condition.value;

      if (Array.isArray(expected)) {
        return expected.includes(answer);
      }

      return answer === expected;
    });
  }

  get currentStep() {
    return this.visibleSteps[this.currentStepIndex()];
  }

  get progressPercentage(): number {
    const total = this.visibleSteps.length;
    const current = this.currentStepIndex() + 1;
    return Math.round((current / total) * 100);
  }

  selectOption(option: string) {
    this.formData[this.currentStep.formKey] = option;
    this.nextStep();
  }

  submitInputRange(inputValues: (string | number | null)[]) {
    const key = this.currentStep.formKey;
    this.formData[key] = inputValues;
    this.nextStep();
  }

  submitInput(inputValue: string | number | null) {
    const key = this.currentStep.formKey;

    if (
      inputValue === null ||
      inputValue === undefined ||
      inputValue === '' ||
      this.noFormControl.errors ||
      (this.emailFormControl.errors && key === 'email')
    ) {
      // Mark step as invalid
      this.snackBar.open('Please answer this question before continuing.', 'OK', {
        duration: 3000,
      });
      return;
    }

    this.formData[key] = inputValue;
    this.nextStep();
  }

  nextStep() {
    this.sliderValue = null;
    const steps = this.visibleSteps;
    if (this.currentStepIndex() < steps.length - 1) {
      this.currentStepIndex.update((v) => v + 1);
      // Reset input value for the new step if it's an input type
      const newStep = this.visibleSteps[this.currentStepIndex()];
      if (newStep && newStep.type === 'input' && this.formData[newStep.formKey] === undefined) {
        //this.formData[newStep.formKey] = '';
        // Clear the input element's value directly
        setTimeout(() => {
          if (this.inputElRef && this.inputElRef.nativeElement) {
            this.inputElRef.nativeElement.value = '';
          }
        });
      }
    } else {
      console.log('Form submitted:', this.formData);
      // TODO: POST to backend here
      //this.submitForm();
    }
  }

  previousStep() {
    if (this.currentStepIndex() > 0) {
      this.currentStepIndex.update((v) => v - 1);
    }
  }

  sliderValue: number | null = null;

  get currentSliderValue() {
    return this.sliderValue !== null ? this.sliderValue : (this.currentStep?.sliderConfig?.defaultValue ?? 0);
  }

  get currentValue() {
    return this.formData[this.currentStep.formKey] ?? null;
  }
  get currentRangeValues() {
    return this.formData[this.currentStep.formKey] ?? [this.currentStep.sliderConfig?.min, this.currentStep.sliderConfig?.defaultValue];
  }

  addNumbers(a: number, b: number): number {
    return a + b;
  }
}
