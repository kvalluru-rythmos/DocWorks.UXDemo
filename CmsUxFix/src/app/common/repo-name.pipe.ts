import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'repoName'
})
export class RepoNamePipe implements PipeTransform {

  transform(value: any, args?: any): any {
      if (value) {
          let withoutProtocol = value.split('//')[1];
          if (withoutProtocol) {
              let withoutDomain = withoutProtocol.split('/').slice(1).join('/');
              if (withoutDomain) {
                  return withoutDomain.split('.')[0];
              } else {
                  return value;
              }
          } else {
              return value;
          }
      } else {
          return value;
      }
  }
}
