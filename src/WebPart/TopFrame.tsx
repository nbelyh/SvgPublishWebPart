import * as React from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { IWebPartProps } from "./IWebPartProps";
import { ErrorPlaceholder } from './components/ErrorPlaceholder';
import * as strings from 'WebPartStrings';
import { Breadcrumb, IBreadcrumbItem, ThemeProvider } from '@fluentui/react';
import { LinkClickedEvent } from 'svgpublish';
import { SvgPublishComponent } from 'svgpublish-react';

export function TopFrame(props: {
  context: WebPartContext;
  webpart: IWebPartProps;
  isReadOnly: boolean;
}) {

  const [url, setUrl] = React.useState<string>(props.webpart.url);

  const onBreadcrumbClick = (ev?: React.MouseEvent<HTMLElement>, item?: IBreadcrumbItem) => {
    const foundIndex = breadcrumb.current.findIndex(x => x.key === item.key);
    breadcrumb.current.splice(foundIndex+1);
    setUrl(item.key);
  };

  const breadcrumbDefault = [{ key: props.webpart.url, text: "Home", onClick: onBreadcrumbClick }];
  const breadcrumb = React.useRef<IBreadcrumbItem[]>(breadcrumbDefault);

  const onLinkClicked = (evt: LinkClickedEvent) => {

    evt.preventDefault();

    const args = evt.detail;
    const link = args.link;

    const pageId = link.PageId;
    if (pageId >= 0) {
      const diagram = evt.detail.context.diagram;
      const page = diagram.pages.find(p => p.Id === pageId);
      const pageUrl = url.substring(0, url.lastIndexOf('/') + 1) + page.FileName;
      breadcrumb.current.push({ key: pageUrl, text: args.shape.Text, onClick: onBreadcrumbClick })
      setUrl(pageUrl);
    } else {
      if (link.Address) {
        if (!link.Address.startsWith('https:') && link.Address.endsWith('.svg')) { // another local diagram
          const pageUrl = url.substring(0, url.lastIndexOf('/') + 1) + link.Address;
          breadcrumb.current.push({ key: pageUrl, text: args.shape.Text, onClick: onBreadcrumbClick })
          setUrl(pageUrl);
        } else {
          window.open(link.Address, '_blank');
        }
      }
    }
  };

  const [error, setError] = React.useState('');

  const showPlaceholder = !url || error;

  const rootStyle: React.CSSProperties = {
    height: props.webpart.height,
    width: props.webpart.width,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  };

  return (
    <ThemeProvider style={rootStyle}>
      {props.webpart.enableBreadcrumb && <Breadcrumb styles={{ root: { margin: 0 }}} items={breadcrumb.current} />}
      {showPlaceholder && <ErrorPlaceholder context={props.context} isReadOnly={props.isReadOnly} error={error} />}
      <SvgPublishComponent
        enableSelection
        enableFollowHyperlinks
        enableHover
        url={url}
        width={props.webpart.width}
        height={props.webpart.height}
        enableZoom={props.webpart.enableZoom}
        enableLinks={props.webpart.enableLinks}
        enablePan={props.webpart.enablePan}
        onLinkClicked={onLinkClicked}
      />
    </ThemeProvider>
  );
}
