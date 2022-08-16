import { Component, OnInit } from '@angular/core';
import Viewer from 'dmn-js';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dmn',
  templateUrl: './dmn.component.html',
  styleUrls: ['./dmn.component.scss'],
})
export class DmnComponent implements OnInit {
  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  init() {
    this.http
      .get('./assets/default.dmn', { responseType: 'text' })
      .subscribe((x) => {
        const xml = x; // my DMN 1.1 xml
        //var myContainer = document.getElementsByClassName('canvas');
        const viewer = new Viewer({
          container: '.canvas',
        });

        // @ts-ignore
        viewer.importXML(xml, function (err) {
          console.log('*********************');
          if (err) {
            console.log('error rendering', err);
          } else {
            viewer.getActiveViewer().get('canvas').zoom('fit-viewport');
          }
        });
      });
  }
}
