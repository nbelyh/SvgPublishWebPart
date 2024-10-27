
export interface IWebPartProps {
  url: string;

  width: string;
  height: string;

  enableLinks: boolean;
  enablePan: boolean;
  enableZoom: boolean;

  enableHeader: boolean;
  enableBreadcrumb: boolean;
  enableCopyHashLink: boolean;
  enableFeedback: boolean;
  feedbackUrl: string;
  feedbackButtonText: string;

  enableUsageLog: boolean;
  usageLogListTitle: string;

  enableSelection: boolean;
  enableBoxSelection: boolean;
  selectionMode: string;
  enableFollowHyperlinks: boolean;
  openHyperlinksInNewWindow: boolean;
  enableHover: boolean;
  hyperlinkColor: string;
  selectColor: string;
  hoverColor: string;

  dilate: number;
  enableDilate: boolean;

  blur: number;
  enableBlur: boolean;

  connDilate: number;
  enableConnDilate: boolean;

  enablePrevShapeColor?: boolean;
  enableNextShapeColor?: boolean;
  enablePrevConnColor?: boolean;
  enableNextConnColor?: boolean;
  prevShapeColor?: string;
  nextShapeColor?: string;
  prevConnColor?: string;
  nextConnColor?: string;

}
