import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import propertiesPanel from 'bpmn-js-properties-panel';
import propertiesProvider from 'bpmn-js-properties-panel/lib/provider/camunda';
import Modeler from 'bpmn-js/lib/Modeler';
import { Observable } from 'rxjs';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ng-bpmn',
  template: `
    <div class="container">
      <div [id]="'js-drop-zone-' + idIndex" class="content with-diagram">
        <div #bpmnModeler [id]="'js-canvas-' + idIndex" class="canvas"></div>
        <div
          #bpmnProperties
          [id]="'js-properties-panel-' + idIndex"
          class="properties-panel-parent"
        ></div>
      </div>
    </div>
  `,
  styleUrls: ['./bpmn-editor.scss'],
})
export class BpmnEditorComponent implements OnDestroy, OnInit {
  static ID_INDEX = 0;
  isBusy = false;

  readonly idIndex = Number.isInteger(BpmnEditorComponent.ID_INDEX + 1)
    ? BpmnEditorComponent.ID_INDEX++
    : (BpmnEditorComponent.ID_INDEX = 0);
  @Input() key: string;
  @Input() mayWrite: boolean;

  @Output() readonly discard: EventEmitter<boolean> = new EventEmitter();
  @ViewChild('bpmnModeler', { static: true })
  private readonly bpmModelerElm: ElementRef;
  @ViewChild('bpmnProperties', { static: true })
  private readonly bpmPropertiesElm: ElementRef;

  private bpmnJS!: Modeler;

  constructor() {}

  ngOnInit(): void {
    this.bpmnJS = new Modeler({
      container: this.bpmModelerElm.nativeElement,

      propertiesPanel: {
        parent: this.bpmPropertiesElm.nativeElement,
      },
      additionalModules: [propertiesPanel, propertiesProvider],
      // needed if you'd like to maintain camunda:XXX properties in the properties panel
    });
  }

  getXml(): Observable<string> {
    return new Observable((subscriber) => {
      this.bpmnJS.saveXML({ format: true }, (err: Error, xml: string): void => {
        if (!!err) {
          subscriber.error(err);
        } else {
          subscriber.next(xml);
        }
        subscriber.complete();
      });
    });
  }

  loadXmlString(xml: string): void {
    this.bpmnJS.importXML(xml, (err: Error) => {
      if (err) {
        console.error('Error loading BPMN model', err);
      }
    });
  }

  onClickDownloadBpmn($event: MouseEvent): void {
    $event.preventDefault();
    this.getXml().subscribe((xml: string) => {
      // console.info(xml);
    });
  }

  ngOnDestroy(): void {}
}
