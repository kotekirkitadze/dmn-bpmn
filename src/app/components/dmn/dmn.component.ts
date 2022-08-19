import { Component, OnInit } from '@angular/core';
// import Viewer from 'dmn-js';
import { HttpClient } from '@angular/common/http';
// import camundaModdleDescriptor from 'camunda-dmn-moddle/resources/camunda';
// // import * as camundaModdleDescriptor from 'camunda-dmn-moddle/resources/camunda.json';
import camundaModdleDescriptor from 'camunda-dmn-moddle';
import propertiesPanelModule from 'dmn-js-properties-panel';
import propertiesProviderModule from 'dmn-js-properties-panel/lib/provider/camunda';
import drdAdapterModule from 'dmn-js-properties-panel/lib/adapter/drd';
// import 'dmn-js-properties-panel/dist/assets/dmn-js-properties-panel.css';
import DmnJS from 'dmn-js/lib/Modeler';
@Component({
  selector: 'app-dmn',
  templateUrl: './dmn.component.html',
  styleUrls: ['./dmn.component.scss'],
})
export class DmnComponent implements OnInit {
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.init();
  }

  init() {
    this.http
      .get('./assets/default.dmn', { responseType: 'text' })
      .subscribe((x) => {
        const xml = x; // my DMN 1.1 xml
        //var myContainer = document.getElementsByClassName('canvas');
        this.test(x);
        // @ts-ignore
      });
  }

  test(dmn: any) {
    const dmnJS = new DmnJS({
      container: document.getElementById('container'),
      // width: '100%',
      // height: '100%',
      // position: 'absolute',
      decisionTable: {
        keyboard: {
          bindTo: document,
        },
      },
      moddleExtensions: {
        camunda: camundaModdleDescriptor,
      },
      drd: {
        additionalModules: [
          propertiesPanelModule,
          propertiesProviderModule,
          drdAdapterModule,
        ],
      },
    });

    dmnJS.on('views.changed', ({ activeView }) => {
      const propertiesPanel = dmnJS
        .getActiveViewer()
        .get('propertiesPanel', false);

      if (propertiesPanel) {
        propertiesPanel.detach();

        if (activeView.type === 'drd') {
          propertiesPanel.attachTo(
            document.getElementById('properties-panel-container')
          );
        }
      }
    });

    dmnJS.importXML(dmn, (err) => {
      if (err) {
        return console.log(err);
      }
    });
  }
  // init() {
  //   const dmnJS = new DmnJS({
  //     container: document.getElementById('container'),
  //     width: '100%',
  //     height: '100%',
  //     position: 'absolute',
  //     decisionTable: {
  //       keyboard: {
  //         bindTo: document,
  //       },
  //     },
  // moddleExtensions: {
  //   camunda: camundaModdleDescriptor,
  // },
  //     drd: {
  //       additionalModules: [
  //         propertiesPanelModule,
  //         propertiesProviderModule,
  //         drdAdapterModule,
  //       ],
  //     },
  //   });
  // }
}
