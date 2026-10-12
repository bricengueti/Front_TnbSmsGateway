import { inject, Injectable, Injector, OnInit } from "@angular/core";
import { ControlValueAccessor, FormControl, FormControlDirective, FormControlName, FormGroupDirective, NgControl, NgModel } from "@angular/forms";

@Injectable()
export abstract class BaseControlValueAccessorComponent<T> implements ControlValueAccessor, OnInit {

  injector = inject(Injector);
  value: any ;
  control: any;

  onChange = (value: T) => {
  }
  onTouch = () => {
  }

  ngOnInit() {
    this.control = this.getControl();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  writeValue(value: T): void {
    this.value = value;
  }



   public getControl(): FormControl | null {
    const injectedControl = this.injector.get(NgControl, null);
    if (!injectedControl) return null;

    if (injectedControl instanceof NgModel) {
      return (injectedControl as NgModel).control;
    }
    if (injectedControl instanceof FormControlName) {
      return this.injector.get(FormGroupDirective).getControl(injectedControl as FormControlName);
    }
    if (injectedControl instanceof FormControlDirective) {
      return (injectedControl as FormControlDirective).form as FormControl;
    }

    return null;
  }

handleChange(event: Event): any {
  const selectElement = event.target as HTMLSelectElement;
  const selectedValue = selectElement.value;
  this.value = selectedValue;
  this.onChange(selectedValue as T); // 👈 forçage ici
  this.onTouch();
  return selectedValue;
}


}
