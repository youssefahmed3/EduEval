import { Component, forwardRef, Input } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-select',
  imports: [FormsModule],
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ]
})
export class SelectComponent {
  @Input() selectTitle!: string; // Title for the select dropdown
  @Input() initialValue!: string | number; //
  @Input() className!: string;

  value: any; // Stores the selected value
  onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};

  // Write the value to the component
  writeValue(value: any): void {
    this.value = value;
  }

  // Register the callback to notify the form of a value change
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // Register the callback to notify the form control was touched
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // This method is triggered when the selection changes in the dropdown
  onSelectionChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.value = selectedValue;
    this.onChange(selectedValue); // Notify the form control of the change
    this.onTouched(); // Mark the control as touched
  }
}
