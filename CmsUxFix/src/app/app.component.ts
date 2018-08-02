import { Component, OnInit } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
    title = 'docworks.frontend';

    constructor(overlayContainer: OverlayContainer) {
        overlayContainer.getContainerElement().classList.add('docworksLightTheme');
    }

    ngOnInit() {
    }


}
