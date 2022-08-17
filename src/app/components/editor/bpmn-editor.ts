import {
  AfterContentInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  ViewChild,
  SimpleChanges,
  EventEmitter,
  OnInit,
} from '@angular/core';
import * as X2JS from 'x2js';
import { HttpClient } from '@angular/common/http';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule,
} from 'bpmn-js-properties-panel';
import propertiesPanel from 'bpmn-js-properties-panel';
import propertiesProvider from 'bpmn-js-properties-panel/lib/provider/camunda';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ng-bpmn',
  template: `
    <div class="modeler">
      <div id="canvas"></div>
      <div class="properties-panel" id="properties"></div>
    </div>
  `,
  styleUrls: ['./editor.scss'],
})
export class BpmnEditorComponent
  implements AfterContentInit, OnChanges, OnDestroy, OnInit
{
  public bpmnJS: any; // BpmnJS

  @ViewChild('ref') public el: ElementRef;
  @Output() private importDone: EventEmitter<any> = new EventEmitter();
  @Input() public url: string;
  @Input() public type: string; // viewer or modeler

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // const options = {
    //   container: '.diagram-container',
    // };
    // if (this.type === 'modeler') {
    //   this.bpmnJS = new BpmnModelerJS(options);
    // } else if (this.type === 'viewer') {
    //   this.bpmnJS = new BpmnViewerJS(options);
    // } else {
    //   this.bpmnJS = new BpmnJS(options);
    // }
    // this.bpmnJS.on('import.done', (data: any) => {
    //   if (!data.error) {
    //     this.bpmnJS.get('canvas').zoom('fit-viewport');
    //   }
    // });
    this.init();
  }

  init() {
    this.bpmnJS = new BpmnModeler({
      container: '#canvas',
      propertiesPanel: {
        parent: '#properties',
      },
      additionalModules: [propertiesPanel, propertiesProvider],
    });
  }

  ngAfterContentInit(): void {
    // this.bpmnJS.attachTo(this.el.nativeElement);
  }

  ngOnChanges(changes: SimpleChanges) {
    // re-import whenever the url changes
    // if (changes.url) {
    //   this.loadUrl(changes.url.currentValue);
    // }
  }

  ngOnDestroy(): void {
    this.bpmnJS.destroy();
  }

  /**
   * Load diagram from URL and emit completion event
   */
  loadUrl(url: string) {
    return this.http.get(url, { responseType: 'text' }).subscribe(
      (xml) => {
        this.loadXml(xml);
      },
      (err) => {
        this.importDone.emit({
          type: 'error',
          error: err,
        });
      }
    );
  }

  loadXml(xml) {
    this.bpmnJS.importXML(xml, (err: any, warnings: any) => {
      if (err) {
        this.importDone.emit({
          type: 'error',
          error: err,
        });
      } else {
        this.importDone.emit({
          type: 'success',
          warnings,
        });
      }
    });
  }

  getJson() {
    return new Promise((resolve, reject) => {
      this.bpmnJS.saveXML((err, xml) => {
        if (err) {
          return reject(err);
        }
        const x2js = new X2JS();
        const json = x2js.xml2js(xml);
        resolve(json);
      });
    });
  }

  loadJson(json) {
    const x2js = new X2JS();
    const xml = x2js.js2xml(json);
    this.loadXml(xml);
    return xml;
  }
}
