import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import { <%= ucFirst(createFilename) %> } from './<%= ucFirst(createFilename) %>';
import { <%= ucFirst(listFunction) %> } from './<%= ucFirst(listFunction) %>';
import { <%= ucFirst(updateFunction) %> } from './<%= ucFirst(updateFunction) %>';

export const declarations = [
  <%= ucFirst(createFilename) %>,
  <%= ucFirst(listFunction) %>,
  <%= ucFirst(updateFunction) %>,
];

@NgModule({
  declarations: declarations,
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: declarations
})
export class <%= module %> {}
