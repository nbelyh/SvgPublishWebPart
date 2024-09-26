
export interface IWebPartProps {
  url: string;

  width: string;
  height: string;

  enableLinks: boolean;
  enablePan: boolean;
  enableZoom: boolean;

  enableBreadcrumb: boolean;
  enableSelection: boolean;
  enableBoxSelection: boolean;
  selectionMode: string;
  enableFollowHyperlinks: boolean;
  openHyperlinksInNewWindow: boolean;
  enableHover: boolean;
  hyperlinkColor: string;
  selectColor: string;
  hoverColor: string;
}
