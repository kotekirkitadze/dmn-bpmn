import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DmnComponent } from './components/dmn/dmn.component';
import { BpmnComponent } from './components/bpmn/bpmn.component';
import { HttpClientModule } from '@angular/common/http';
import { BpmnEditorComponent } from './components/editor/bpmn-editor';

@NgModule({
  declarations: [
    AppComponent,
    DmnComponent,
    BpmnComponent,
    BpmnEditorComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
