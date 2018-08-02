export interface ISlimScrollOptions {
  position?: string;
  barBackground?: string;
  barOpacity?: string;
  barWidth?: string;
  barBorderRadius?: string;
  barMargin?: string;
  gridBackground?: string;
  gridOpacity?: string;
  gridWidth?: string;
  gridBorderRadius?: string;
  gridMargin?: string;
  alwaysVisible?: boolean;
  visibleTimeout?: number;
  scrollSensitivity?: number;
}

export class SlimScrollOptions implements ISlimScrollOptions {
  position?: string;
  barBackground?: string;
  barOpacity?: string;
  barWidth?: string;
  barBorderRadius?: string;
  barMargin?: string;
  gridBackground?: string;
  gridOpacity?: string;
  gridWidth?: string;
  gridBorderRadius?: string;
  gridMargin?: string;
  alwaysVisible?: boolean;
  visibleTimeout?: number;
  scrollSensitivity?: number;

  constructor(obj?: ISlimScrollOptions) {
    this.position = obj && obj.position ? obj.position : 'right';
    this.barBackground = obj && obj.barBackground ? obj.barBackground : '#343a40';
    this.barOpacity = obj && obj.barOpacity ? obj.barOpacity : '1';
    this.barWidth = obj && obj.barWidth ? obj.barWidth : '4';
    this.barBorderRadius = obj && obj.barBorderRadius ? obj.barBorderRadius : '5';
    this.barMargin = obj && obj.barMargin ? obj.barMargin : '1px 0';
    this.gridBackground = obj && obj.gridBackground ? obj.gridBackground : '#adb5bd';
    this.gridOpacity = obj && obj.gridOpacity ? obj.gridOpacity : '1';
    this.gridWidth = obj && obj.gridWidth ? obj.gridWidth : '4';
    this.gridBorderRadius = obj && obj.gridBorderRadius ? obj.gridBorderRadius : '10';
    this.gridMargin = obj && obj.gridMargin ? obj.gridMargin : '0px 0px';
    this.alwaysVisible = obj && typeof obj.alwaysVisible !== 'undefined' ? obj.alwaysVisible : true;
    this.visibleTimeout = obj && obj.visibleTimeout ? obj.visibleTimeout : 1000;
    this.scrollSensitivity = obj && obj.scrollSensitivity ? obj.scrollSensitivity : 1;
  }
}
