import { Component, Inject, Injector } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormBuilder } from '@angular/forms';
import { MediaService } from '../media/media.service';
import { DOCUMENT } from '@angular/platform-browser';
import { MediaComponent } from '../media/media.component';

@Component({
  selector: 'app-insert-asset',
  templateUrl: './insert-asset.component.html',
  providers: [MediaService]
})

export class InsertAssetComponent extends MediaComponent {
  assetType: any;
  dom: Document;
  copyToClipboardControl = new FormControl('');
  constructor(public mediaService: MediaService, public injector: Injector,
    public formBuilder: FormBuilder,
    @Inject(DOCUMENT) dom: Document,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    super(injector, mediaService, formBuilder);
    this.assetType = data.assetType;
    this.dom = dom;
  }

  public copyToClipboard(value: string): Promise<any> {
    this.isValueCopied = true;
    const promise = new Promise(
      (resolve, reject): void => {
        let textarea = null;
        try {
          textarea = this.dom.createElement('textarea');
          textarea.style.height = '0px';
          textarea.style.width = '0px';
          this.dom.body.appendChild(textarea);

          textarea.value = value;
          textarea.select();
          this.dom.execCommand('copy');
          resolve(value);
        } finally {
          if (textarea && textarea.parentNode) {
            textarea.parentNode.removeChild(textarea);
          }
        }
      }
    );
    return (promise);
  }
}

