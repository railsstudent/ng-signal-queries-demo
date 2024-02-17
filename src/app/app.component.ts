import { Component, VERSION } from '@angular/core';
import { AppSimpleForm } from './app-simple-form/app-simple-form.component';
import { AppViewChild } from './app-viewchild/app-viewchild.component';
import { AppContentChild } from './app-contentchild/app-contentchild.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AppSimpleForm, AppViewChild, AppContentChild],
  template: `
  <header>Angular {{version}}</header>
  <fieldset>
    <legend>Enjoy signal queries</legend>
    <app-simple-form />
    <app-viewchild />
    <app-contentchild />
  </fieldset>`,
})
export class AppComponent {
  version = VERSION.full;
}
