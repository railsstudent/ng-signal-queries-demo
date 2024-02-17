import { NgClass, NgTemplateOutlet } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, ElementRef, signal, TemplateRef, viewChild, viewChildren } from "@angular/core";

@Component({
  selector: 'app-viewchild',
  standalone: true,
  imports: [NgClass, NgTemplateOutlet],
  template: `
    <div class="container">
      <p>viewchild and viewchildren demo</p>
      <div>
        <p>Select a template</p>
        <button #el (click)="lastClickedBtn.set(1)" data-id="1"
          [ngClass]="vm.btnClasses[0]">1</button>
        <button #el (click)="lastClickedBtn.set(2)" data-id="2" 
          [ngClass]="vm.btnClasses[1]">2</button>
        <button #el (click)="lastClickedBtn.set(3)" data-id="3" 
          [ngClass]="vm.btnClasses[2]">3</button>
        <button #el (click)="lastClickedBtn.set(4)" data-id="4" 
          [ngClass]="vm.btnClasses[3]">4</button>
      </div>
      <ng-container *ngTemplateOutlet="vm.template; context: { $implicit: lastClickedBtn() }" />
    </div>

    <ng-template #t let-id>
      <p>Simple Template {{ id }}</p>
    </ng-template>
  `,
  styles: `
    button {
      margin-right: 0.25rem;
    }

    button.last-clicked {
      background: cyan;
    }

    div.container {
      border: 1px solid black;
      padding: 0.5rem;
      border-radius: 8px;
      margin-top: 0.5rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppViewChild {
  lastClickedBtn = signal<number>(1);
  btnGroups = viewChildren<ElementRef<HTMLButtonElement>>('el');
  t = viewChild.required('t', { read: TemplateRef });

  btnClasses = computed(() => {
    return this.btnGroups().map((b) => {
      const e = b.nativeElement;
      const id = +(e.dataset['id'] || '1');
      return id === this.lastClickedBtn() ? 'last-clicked' : '';
    });
  }); 

  viewModel = computed(() => ({
      template: this.t(),
      lastClicked: this.lastClickedBtn(),
      btnClasses: this.btnClasses(),
    })
  );

  get vm() {
    return this.viewModel();
  }
}