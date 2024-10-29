import { DiagramInfoTooltipPlacement, DiagramInfoTooltipTheme, DiagramInfoTooltipTrigger } from 'svgpublish-react';

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
  forceOpeningOfficeFilesOnline: boolean;

  rewriteVsdxHyperlinks: boolean;
  rewriteDocxHyperlinks: boolean;

  enableHover: boolean;
  hyperlinkColor: string;
  selectionColor: string;
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

  enableTooltips?: boolean;
  enableTooltipMarkdown?: boolean;
  tooltipMarkdown?: string;

  tooltipTrigger?: DiagramInfoTooltipTrigger;
  tooltipDelay?: boolean;
  tooltipDelayShow?: number;
  tooltipDelayHide?: number;
  tooltipPlacement?: DiagramInfoTooltipPlacement;
  tooltipUseMousePosition?: boolean;
  tooltipInteractive?: boolean;
  tooltipTheme?: DiagramInfoTooltipTheme;
}
