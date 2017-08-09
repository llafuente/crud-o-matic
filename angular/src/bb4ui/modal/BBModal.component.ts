import { Component, Input, ViewChild } from "@angular/core";
import { ModalDirective } from "ngx-bootstrap/modal";

// NOTE: remove tabindex="-1" to remove ESC key dismissal

@Component({
  selector: "bb-modal",
  templateUrl: "./BBModal.component.html",
})
export class BBModalComponent {
  @Input() header: string = null;
  @Input() closeButton = true;
  @Input() size = "lg";

  @ViewChild("modal") modalManager: ModalDirective;

  show() {
    this.modalManager.show();
  }

  hide() {
    this.modalManager.hide();
  }
}
