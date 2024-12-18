import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-textarea',
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true
    }
  ]
})
export class TextareaComponent implements ControlValueAccessor {
  @Input({ required: true }) inputName!: string; // Input for the label
  value: string = ''; // Value bound to ngModel

  // Function references for ControlValueAccessor
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  // Write the value from the parent into the textarea
  writeValue(value: string): void {
    this.value = value || ''; // Set default empty value if undefined
  }

  // Register the change function for ngModel
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  // Register the touch function for ngModel
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // Trigger change on user input
  onInputChange(event: Event): void {
    const inputValue = (event.target as HTMLTextAreaElement).value;
    this.value = inputValue;
    this.onChange(inputValue); // Notify ngModel of the change
  }

  // Trigger onTouched when the textarea loses focus
  onBlur(): void {
    this.onTouched();
  }
}
