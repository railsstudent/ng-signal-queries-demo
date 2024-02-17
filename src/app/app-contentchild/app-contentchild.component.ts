import { NgTemplateOutlet } from "@angular/common";
import { AfterContentInit, ChangeDetectionStrategy, Component, computed, contentChild, contentChildren, effect, ElementRef, input, signal } from "@angular/core";

@Component({
  selector: 'app-wrapper',
  standalone: true,
  imports: [NgTemplateOutlet],
  template: `
    <div>
      <ng-content select=".title" />
      <ng-content select=".btn" />
    </div>

    <ng-container *ngTemplateOutlet="t; context: { $implicit: buttonId() }" />

    <ng-template #t let-data>
      <p>Simple Template {{ data }}</p>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppWrapper implements AfterContentInit {
  title = contentChild<ElementRef<HTMLParagraphElement>>('title');
  btnGroups = contentChildren<ElementRef<HTMLButtonElement>>('btn');
  buttonId = input.required<number>();

  constructor() {
    effect(() => {
      this.setBackgroundColor(this.buttonId());      
    });
  }

  ngAfterContentInit(): void {
    const title = this.title();

    if (title) {
      const { nativeElement: { style } } = title;
      style.fontWeight = 'bold';
      style.fontStyle = 'italic'; 
      style.fontSize = '24px';
    }
  }

  setBackgroundColor(buttonId: number) {
    this.btnGroups().map((b) => {
      const element = b.nativeElement;
      const id = +(element.dataset['id'] || '1')
      const className = buttonId === id ? 'last-clicked' : '';
      element.className = className;
    });    
  }
}

@Component({
  selector: 'app-contentchild',
  standalone: true,
  imports: [AppWrapper],
  template: `
    <div class="container">
      <p>contentchild and contentchildren demo</p>
      <app-wrapper [buttonId]="vm.clickedId">
        <p class="title" #title>Select a template</p>
        <button #btn class="btn" data-id="1" (click)="clickedBtn.set(1)">1</button>
        <button #btn class="btn" data-id="2" (click)="clickedBtn.set(2)"
        >2</button>
        <button #btn class="btn" data-id="3" (click)="clickedBtn.set(3)">3</button>
        <button #btn class="btn" data-id="4" (click)="clickedBtn.set(4)">4</button>
      </app-wrapper>
    </div>
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
export class AppContentChild {
  clickedBtn = signal(1);

  viewModel = computed(() => ({
    clickedId: this.clickedBtn(),
  }));

  get vm() {
    return this.viewModel();
  }
}
