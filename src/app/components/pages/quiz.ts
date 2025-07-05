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
  selector: 'app-quiz',
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
  template: `<mat-progress-bar
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

      <!-- CARD TYPE -->
      @if (currentStep.type === 'cards') {
        <div class="step">
          <div class="card-grid">
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
    </div>`,
})
export class QuizComponent implements AfterViewInit {
  currentStepIndex = signal(0);
  formData: Record<any, any> = {};

  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  noFormControl = new FormControl('', [Validators.required]);
  @ViewChild('inputEl') inputElRef!: ElementRef<HTMLInputElement>;

  steps: QuizStep[] = [
    {
      type: 'cards',
      question: 'What kind of home do you own?',
      formKey: 'homeType',
      html: `<h1>Get Access to Your Home Equity</h1>
            <p>Use your equity for anything. Remodel the kitchen, pay for college, or cover an emergency – a HELOC gives you funds when you need them, at a lower rate than credit cards.</p>`,
      cards: [
        {
          title: 'Single Family',
          imageUrl: '/single-family-home.png',
          value: 'Single Family',
        },
        {
          title: 'Condominium',
          imageUrl: '/condominium.png',
          value: 'Condominium',
        },
        {
          title: 'Townhouse',
          imageUrl: '/townhome.png',
          value: 'Townhouse',
        },
        {
          title: 'Multi-Family Home',
          imageUrl: '/multi-family-home.png',
          value: 'Multi-Family Home',
        },
      ],
    },
    {
      type: 'buttons',
      question: 'How do you use this property?',
      options: ['Primary Residence', 'Secondary Residence', 'Investment Property'],
      formKey: 'propertyUsage',
    },
    {
      type: 'input',
      question: 'What is the zipcode of your property?',
      inputType: 'text',
      formKey: 'zipcode',
      label: 'Zipcode',
      maxLength: 5,
    },
    {
      type: 'buttons',
      question: 'What are you using this loan for?',
      options: ['Home Improvement', 'Retirement Income', 'Debt Consolidation', 'Investment Purposes', 'Something else'],
      formKey: 'loanPurpose',
    },
    {
      type: 'slider',
      question: 'What is the estimated value of your property?',
      formKey: 'estimatedValue',
      sliderConfig: {
        min: 200000,
        max: 2000000,
        step: 20000,
        defaultValue: 400000,
        unit: '$',
      },
    },
    {
      type: 'buttons',
      question: 'Do you have a mortgage on this property?',
      options: ["No, it's paid off", 'One Mortgage', 'Two Mortgages'],
      formKey: 'mortgageStatus',
    },
    {
      type: 'slider',
      question: "What's your first mortgage balance? (an estimate is fine)",
      formKey: 'firstMortgageBalance',
      sliderConfig: {
        min: 0,
        max: 1500000,
        step: 10000,
        defaultValue: 200000,
        unit: '$',
      },
      condition: {
        dependsOn: 'mortgageStatus',
        value: ['One Mortgage', 'Two Mortgages'],
      },
    },
    {
      type: 'slider',
      question: "What's your second mortgage balance? (an estimate is fine)",
      formKey: 'secondMortgageBalance',
      sliderConfig: {
        min: 0,
        max: 1500000,
        step: 10000,
        defaultValue: 200000,
        unit: '$',
      },
      condition: {
        dependsOn: 'mortgageStatus',
        value: ['Two Mortgages'],
      },
    },
    {
      type: 'buttons',
      question: "What's your current credit score? (an estimate is fine)",
      options: [
        'Excellent (720+)',
        'Good (680-719)',
        'Fair (660-679)',
        'Needs Improvement (620-659)',
        'Credit Challenged (580-619)',
        'Needs Rebuilding (below 580)',
      ],
      formKey: 'creditScore',
    },
    {
      type: 'buttons',
      question: 'Have you or your spouse served in the military?',
      options: ['Yes', 'No'],
      formKey: 'militaryService',
    },
    {
      type: 'buttons',
      question: 'Have you had a bankruptcy or foreclosure in the last 7 years?',
      options: ['No', 'Bankruptcy', 'Foreclosure', 'Both'],
      formKey: 'bankruptcyOrForeclosure',
    },
    {
      type: 'buttons',
      question: 'How long ago was the bankruptcy?',
      options: ['Within the last year', '1-2 years ago', '3-4 years ago', '5-7 years ago', 'More than 7 years ago'],
      formKey: 'bankruptcyRecency',
      condition: {
        dependsOn: 'bankruptcyOrForeclosure',
        value: ['Bankruptcy', 'Both'],
      },
    },
    {
      type: 'buttons',
      question: 'How long ago was the foreclosure?',
      options: ['Within the last year', '1-2 years ago', '3-4 years ago', '5-7 years ago', 'More than 7 years ago'],
      formKey: 'foreclosureRecency',
      condition: {
        dependsOn: 'bankruptcyOrForeclosure',
        value: ['Foreclosure', 'Both'],
      },
    },
    {
      type: 'info',
      question: '',
      formKey: 'info',
      html: `<h1>Great News!</h1><p>We've found options for you.</p><p>Continue to the final steps so we can provide your personalized home financing solutions.</p><div class='free'>This consultation is 100% FREE and there is no obligation!</div>`,
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

  addNumbers(a: number, b: number): number {
    return a + b;
  }
}
