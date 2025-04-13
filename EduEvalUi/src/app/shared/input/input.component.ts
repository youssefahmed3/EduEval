import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input',
  imports: [FormsModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent {
  @Input({ required: true }) inputName!: string;
  @Input({ required: false }) type!: "text" | "password" | 'number';
  @Input() value: string = '';  // For ngModel binding
  @Input() textTitleColor?: string;
  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>(); // For two-way binding

  // Function to call when the value changes
  onChange: any = () => { };
  onTouched: any = () => { };

  // Write the value to the input
  writeValue(value: string): void {
    if (value !== undefined) {
      this.value = value;
    }
  }

  // Register the change function (from the parent)
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // Register the touched function (from the parent)
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /* // Emit changes to parent
  onValueChange(value: string) {
    this.valueChange.emit(value);
  } */
  // Emit changes when the user types
  onValueChange(value: string): void {
    this.onChange(value);
  }
}
