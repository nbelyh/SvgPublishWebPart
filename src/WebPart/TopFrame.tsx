import * as React from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { IWebPartProps } from "./IWebPartProps";
import { BlankPlaceholder } from './components/BlankPlaceholder';
import { Breadcrumb, IBreadcrumbItem, ThemeProvider } from '@fluentui/react';
import { SvgPublishComponent, LinkClickedEvent } from 'svgpublish-react';
import { stringifyError } from './Errors';
import { ErrorPlaceholder } from './components/ErrorPlaceholder';
import { UsageLogService } from './services/UsageLogService';

export function TopFrame(props: {
  context: WebPartContext;
  webpart: IWebPartProps;
  isReadOnly: boolean;
}) {

  const [url, _setUrl] = React.useState<string>(props.webpart.url);

  const setUrl = (url: string) => {
    _setUrl(url);
    UsageLogService.logUrl(url);
  }

  const onBreadcrumbClick = (ev?: React.MouseEvent<HTMLElement>, item?: IBreadcrumbItem) => {
    setBreadcrumb(b => b.slice(0, b.findIndex(i => i.key === item.key) + 1));
    setUrl(item.key);
    setError('');
  };

  const [breadcrumb, setBreadcrumb] = React.useState<IBreadcrumbItem[]>(props.webpart.url ? [{ key: props.webpart.url, text: "Home", onClick: onBreadcrumbClick }] : []);

  React.useEffect(() => {
    setUrl(props.webpart.url);
    setBreadcrumb([{ key: props.webpart.url, text: "Home", onClick: onBreadcrumbClick }]);
  }, [props.webpart.url]);


  const onLinkClicked = (evt: LinkClickedEvent) => {

    evt.preventDefault();

    const args = evt.detail;
    const link = args.link;

    const pageId = link.PageId;
    if (pageId >= 0) {
      const diagram = evt.detail.context.diagram;
      const page = diagram.pages.find(p => p.Id === pageId);
      const pageUrl = url.substring(0, url.lastIndexOf('/') + 1) + page.FileName;
      setBreadcrumb(b => [...b, { key: pageUrl, text: args.shape.Text, onClick: onBreadcrumbClick }]);
      setUrl(pageUrl);
    } else {
      if (link.Address) {
        if (!link.Address.startsWith('https:') && link.Address.endsWith('.svg')) { // another local diagram
          const pageUrl = url.substring(0, url.lastIndexOf('/') + 1) + link.Address;
          setBreadcrumb(b => [...b, { key: pageUrl, text: args.shape.Text, onClick: onBreadcrumbClick }]);
          setUrl(pageUrl);
        } else {
          UsageLogService.logUrl(link.Address);
          window.open(link.Address, '_blank');
        }
      }
    }
  };

  const onError = (err: Error) => {
    const msg = stringifyError(err);
    setError(msg);
  }

  const [error, setError] = React.useState('');

  const rootStyle: React.CSSProperties = {
    height: props.webpart.height,
    width: props.webpart.width,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  };

  return (
    <ThemeProvider style={rootStyle}>
      {props.webpart.enableBreadcrumb && <Breadcrumb styles={{ root: { margin: 0 }}} items={breadcrumb} />}
      {!url  && <BlankPlaceholder context={props.context} isReadOnly={props.isReadOnly} />}
      {!!error  && <ErrorPlaceholder error={error} />}
      <SvgPublishComponent
        url={url}
        enableSelection={props.webpart.enableSelection}
        enableBoxSelection={props.webpart.enableBoxSelection}
        selectionMode={props.webpart.selectionMode as any}
        enableFollowHyperlinks={props.webpart.enableFollowHyperlinks}
        openHyperlinksInNewWindow={props.webpart.openHyperlinksInNewWindow}
        hyperlinkColor={props.webpart.hyperlinkColor}
        selectColor={props.webpart.selectColor}
        hoverColor={props.webpart.hoverColor}
        enableHover={props.webpart.enableHover}
        width={props.webpart.width}
        height={props.webpart.height}
        enableZoom={props.webpart.enableZoom}
        enableLinks={props.webpart.enableLinks}
        enablePan={props.webpart.enablePan}
        dilate={props.webpart.dilate}
        enableDilate={props.webpart.enableDilate}
        blur={props.webpart.blur}
        enableBlur={props.webpart.enableBlur}
        connDilate={props.webpart.connDilate}
        enableConnDilate={props.webpart.enableConnDilate}
        enablePrevShapeColor={props.webpart.enablePrevShapeColor}
        enableNextShapeColor={props.webpart.enableNextShapeColor}
        enablePrevConnColor={props.webpart.enablePrevConnColor}
        enableNextConnColor={props.webpart.enableNextConnColor}
        prevShapeColor={props.webpart.prevShapeColor}
        nextShapeColor={props.webpart.nextShapeColor}
        prevConnColor={props.webpart.prevConnColor}
        nextConnColor={props.webpart.nextConnColor}

        onLinkClicked={onLinkClicked}
        onError={onError}
      />
    </ThemeProvider>
  );
}
