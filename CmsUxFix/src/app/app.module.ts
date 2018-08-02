import {
    TreeModule,
    CaptchaModule,
    DragDropModule,
    DialogModule,
    DropdownModule,
    ContextMenuModule,
    SharedModule,
    CarouselModule,
    ChartModule
} from 'primeng/primeng';
import { ColorPickerModule } from 'primeng/colorpicker';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatCardModule,
    MatDialogModule,
    MatTooltipModule,
    MatMenuModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatRadioModule,
    MatCheckboxModule,
    MatIconModule,
    MatNativeDateModule,
    MatSlideToggleModule
} from '@angular/material';
import { MatExpansionModule } from '@angular/material/expansion';
import {
    BrowserAnimationsModule,
    NoopAnimationsModule
} from '@angular/platform-browser/animations';
import {
    FormsModule,
    ReactiveFormsModule
} from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AngularFireModule } from 'angularfire2';
import { FlexLayoutModule } from '@angular/flex-layout';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import {
    routingComponents,
    AppRoutingModule,
    routingProviders,
    entryComponents
} from './app.routing.module';

import { customProviders, customPipes } from './app.providers'; // Custom providers having all services
import { DataTableModule } from 'primeng/components/datatable/datatable';
import { TabViewModule } from 'primeng/components/tabview/tabview';
import { AutoCompleteModule } from 'primeng/components/autocomplete/autocomplete';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ImageCropperModule } from 'ngx-img-cropper';

export const AppModules = [
    BrowserModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatDialogModule,
    MatTooltipModule,
    MatMenuModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatIconModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpModule,
    ContextMenuModule,
    TreeModule,
    ColorPickerModule,
    DataTableModule,
    SharedModule,
    CarouselModule,
    CaptchaModule,
    BrowserModule,
    TabViewModule,
    DragDropModule,
    DropdownModule,
    DialogModule,
    AutoCompleteModule,
    ReactiveFormsModule,
    NoopAnimationsModule,
    FlexLayoutModule,
    MatSidenavModule,
    MatListModule,
    MatRadioModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ImageCropperModule,
    ChartModule,
    MatSlideToggleModule
];


@NgModule({
    declarations: [
        AppComponent,
        entryComponents,
        routingComponents,
        customPipes,
    ],
    imports: [
        AngularFireModule.initializeApp(environment.firestore),
        AppRoutingModule,
        AppModules,
        AngularFirestoreModule,
    ],
    providers: [
        routingProviders,
        customProviders
    ],
    bootstrap: [AppComponent],
    entryComponents: [
        entryComponents
    ]
})
export class AppModule {
}
