export interface QuizStep {
  type: 'buttons' | 'input' | 'cards' | 'slider' | 'info' | 'results';
  question: string;
  formKey: string;
  label?: string;
  options?: string[];
  inputType?: 'text' | 'email' | 'tel';
  maxLength?: number;
  html?: string;
  cards?: {
    title: string;
    imageUrl: string;
    value: string;
  }[];
  sliderConfig?: {
    min: number;
    max: number;
    step: number;
    unit?: string;
    defaultValue: number;
  };
  condition?: {
    dependsOn: string;
    value: string | string[];
  };
}
