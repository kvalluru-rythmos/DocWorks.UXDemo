import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filesize' })
export class FileSizePipe implements PipeTransform {

    private units = [
        'Bytes',
        'KB',
        'MB',
        'GB',
        'TB',
        'PB'
    ];

    transform(bytes: number = 0, precision: number = 2): string {
        if (isNaN(parseFloat(String(bytes))) || !isFinite(bytes)) { return ''; } else {
            bytes = parseFloat(String(bytes));
        }

        let unit = 0;

        while (bytes >= 1024) {
            bytes = bytes / 1024;
            unit++;
        }

        return bytes.toFixed(2) + ' ' + this.units[unit];
    }
}
