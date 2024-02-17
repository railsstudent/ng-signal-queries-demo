import { JsonPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, effect, signal, viewChild } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { debounceTime } from "rxjs";

type FormModel = {
  name: string;
  address: {
    address1: string;
    address2: string;
    postalCode: string;
  }
};

@Component({
  selector: 'app-simple-form',
  standalone: true,
  imports: [FormsModule, JsonPipe],
  template: `
    <form #f="ngForm">
      <div>
        <label for="name">
          <span>Name: </span>
          <input id="name" name="name" type="text" required minLength="3" ngModel size="30">
        </label>
      </div>
      <div ngModelGroup="address">
        <div>
          <label for="address1">
            <span>Address 1: </span>
            <input id="address1" name="address1" type="text" required minlength="3" ngModel size="50">
          </label>
        </div>
        <div>
          <label for="address2">
            <span>Address 2: </span>
            <input id="address2" name="address2" type="text" required minlength="3" ngModel size="50">
          </label>
        </div>
        <div>
          <label for="postalcode">
            <span>Postal Code: </span>
            <input id="postalCode" name="postalCode" type="text" required ngModel>
          </label>
        </div>
      </div>
      <button type="submit" [disabled]="!vm.isFormValid">Submit</button>
    </form>

    @if (vm.isSubmitted) {
      <p>Data submitted: </p>
      <pre>
        {{ vm.formValues | json }}
      </pre>
    }
  `,
  styles: `
    form {
      border: 1px solid black;
      padding: 0.5rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppSimpleForm {
  form = viewChild.required('f', { read: NgForm });

  formValues = signal<FormModel>({
    name: '',
    address: {
      address1: '',
      address2: '',
      postalCode: '',
    }
  });

  isFormValid = signal(false);
  isFormSubmitted = signal(false);

  viewModel = computed(() => {
    return {
      formValues: this.formValues(),
      isFormValid: this.isFormValid(),
      isSubmitted: this.isFormSubmitted(),
    }
  });

  get vm() {
    return this.viewModel();
  }

  constructor() {
    effect((onCleanup) => {
      const formValueChanges$ = this.form().form.valueChanges.pipe(
        debounceTime(0)
      );

      const sub = formValueChanges$.subscribe((v: FormModel) => {
        this.formValues.set(v);
        this.isFormValid.set(this.form().valid || false);
      });

      this.form().ngSubmit.subscribe(() =>
        this.isFormSubmitted.set(true)
      )

      onCleanup(() => sub.unsubscribe());
    });
  }
}
