import { CommonModule } from "@angular/common";
import { ModuleWithProviders, NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ModalModule } from "ngx-bootstrap/modal";
import { TabsModule } from "ngx-bootstrap/tabs";
import { DatepickerModule } from 'ngx-bootstrap/datepicker';


/*
import { BBInputComponent } from './inputs/BBInput.component';
export * from './inputs/BBInput.component';
*/

// buttons
import { BBButtonComponent } from "./buttons/BBButton.component";
export * from "./buttons/BBButton.component";

import { BBButtonExampleComponent } from "./buttons/BBButtonExample.component";
export * from "./buttons/BBButtonExample.component";

// checkboxes
import { BBCheckComponent } from "./checkbox/BBCheck.component";
export * from "./checkbox/BBCheck.component";

import { BBCheckboxesExampleComponent } from "./checkbox/BBCheckboxesExample.component";
export * from "./checkbox/BBCheckboxesExample.component";

// switch
import { BBSwitchComponent } from "./switch/BBSwitch.component";
export * from "./switch/BBSwitch.component";

// cards
import { BBCardComponent } from "./cards/BBCard.component";
export * from "./cards/BBCard.component";

import { BBCardCollapsableComponent } from "./cards/BBCardCollapsable.component";
export * from "./cards/BBCardCollapsable.component";

import { BBCardExampleComponent } from "./cards/BBCardExample.component";
export * from "./cards/BBCardExample.component";

// alerts
import { BBAlertComponent } from "./alerts/BBAlert.component";
export * from "./alerts/BBAlert.component";

import { BBAlertIconComponent } from "./alerts/BBAlertIcon.component";
export * from "./alerts/BBAlertIcon.component";

import { BBAlertsExampleComponent } from "./alerts/BBAlertsExample.component";
export * from "./alerts/BBAlertsExample.component";

// typography
import { BBTypographyExampleComponent } from "./typography/BBTypographyExample.component";
export * from "./typography/BBTypographyExample.component";

// tables
import { BBTableComponent } from "./tables/BBTable.component";
export * from "./tables/BBTable.component";

import { BBTableScrollComponent } from './tables/BBTableScroll.component';
export * from './tables/BBTableScroll.component';

import { BBTablesExampleComponent } from './tables/BBTablesExample.component';
export * from './tables/BBTablesExample.component';

// badges
import { BBBadgesExampleComponent } from "./badges/BBBadgesExample.component";
export * from "./badges/BBBadgesExample.component";

// tabs
import { BBTabsExampleComponent } from "./tabs/BBTabsExample.component";
export * from "./tabs/BBTabsExample.component";

// lists
import { BBListsExampleComponent } from "./lists/BBListsExample.component";
export * from "./lists/BBListsExample.component";

// radios
import { BBRadioComponent } from "./radios/BBRadio.component";
export * from "./radios/BBRadio.component";

import { BBRadiosExampleComponent } from "./radios/BBRadiosExample.component";
export * from "./radios/BBRadiosExample.component";

// inputs
import { BBStaticComponent } from "./inputs/BBStatic.component";
export * from "./inputs/BBStatic.component";

import { BBInputContainerComponent } from "./inputs/BBInputContainer.component";
export * from "./inputs/BBInputContainer.component";

import { BBChildComponent } from "./inputs/BBChild.component";
export * from "./inputs/BBChild.component";

import { BBTextareaAutosize } from "./inputs/BBTextareaAutosize.directive";
export * from "./inputs/BBTextareaAutosize.directive";

import { BBInputsExampleComponent } from "./inputs/BBInputsExample.component";
export * from "./inputs/BBInputsExample.component";

// errors
import { BBErrorsComponent } from "./errors/BBErrors.component";
export * from "./errors/BBErrors.component";
import { BBErrorMessages } from "./errors/BBErrorMessages.service";
export * from "./errors/BBErrorMessages.service";

// content
import { BBSectionHeaderComponent } from "./content/BBSectionHeader.component";
export * from "./content/BBSectionHeader.component";

import { BBSectionContentComponent } from "./content/BBSectionContent.component";
export * from "./content/BBSectionContent.component";

import { BBSectionFooterComponent } from "./content/BBSectionFooter.component";
export * from "./content/BBSectionFooter.component";

import { BBSectionComponent } from "./content/BBSection.component";
export * from "./content/BBSection.component";

import { BBSectionCollapsableComponent } from "./content/BBSectionCollapsable.component";
export * from "./content/BBSectionCollapsable.component";

// modals
import { BBModalComponent } from "./modal/BBModal.component";
export * from "./modal/BBModal.component";

import { BBModalExampleComponent } from "./modal/BBModalExample.component";
export * from "./modal/BBModalExample.component";

// examples

import {
  BBSourceDirective,
  BBSourceExampleComponent,
} from "./examples/BBSourceExample.component";
export * from "./examples/BBSourceExample.component";

import { BBFormsExampleComponent } from "./examples/BBFormsExample.component";
export * from "./examples/BBFormsExample.component";

import { HighlightJSDirective } from "./examples/HighlightJS.directive";
export * from "./examples/HighlightJS.directive";

export const imports = [
  CommonModule,
  FormsModule,
  TabsModule.forRoot(),
  ModalModule.forRoot(),
  DatepickerModule.forRoot(),
];

export const declarations = [
  BBButtonComponent,
  BBButtonExampleComponent,

  BBCheckComponent,
  BBCheckboxesExampleComponent,

  BBSwitchComponent,

  BBRadioComponent,
  BBRadiosExampleComponent,

  BBStaticComponent,
  BBInputContainerComponent,
  BBChildComponent,
  BBTextareaAutosize,
  BBInputsExampleComponent,

  BBErrorsComponent,

  BBCardComponent,
  BBCardCollapsableComponent,
  BBCardExampleComponent,

  BBAlertComponent,
  BBAlertIconComponent,
  BBAlertsExampleComponent,

  BBTypographyExampleComponent,

  BBTableComponent,
  BBTableScrollComponent,
  BBTablesExampleComponent,

  BBBadgesExampleComponent,

  BBTabsExampleComponent,

  BBListsExampleComponent,

  BBSectionHeaderComponent,
  BBSectionContentComponent,
  BBSectionFooterComponent,
  BBSectionComponent,
  BBSectionCollapsableComponent,

  BBModalComponent,
  BBModalExampleComponent,

  BBSourceExampleComponent,
  BBSourceDirective,
  BBFormsExampleComponent,
  HighlightJSDirective,
];

@NgModule({
  declarations,
  imports,
  providers: [BBErrorMessages],
  exports: [
    ...declarations,
    TabsModule,
    ModalModule,
    DatepickerModule,
  ],
})
export class BB4UIModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: BB4UIModule,
    };
  }
}
