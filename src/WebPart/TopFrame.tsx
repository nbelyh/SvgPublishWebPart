import * as React from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { IWebPartProps } from "./IWebPartProps";
import { Breadcrumb, IBreadcrumbItem, ThemeProvider } from '@fluentui/react';
import { sp } from '@pnp/sp';
import { LinkClickedEvent, SvgPublishContext } from 'svgpublish';
import { Errors } from './Errors';
import { ErrorPlaceholder } from './components/ErrorPlaceholder';
import { IDiagramInfo } from 'svgpublish/dist/interfaces/IDiagramInfo';

export function TopFrame(props: {
  context: WebPartContext;
  webpart: IWebPartProps;
  isReadOnly: boolean;
}) {

  const ref = React.useRef(null);
  const [url, setUrl] = React.useState<string>(props.webpart.url);

  const contextRef = React.useRef<SvgPublishContext>(null);

  const onBreadcrumbClick = (ev?: React.MouseEvent<HTMLElement>, item?: IBreadcrumbItem) => {
    const foundIndex = breadcrumb.current.findIndex(x => x.key === item.key);
    breadcrumb.current.splice(foundIndex+1);
    setUrl(item.key);
  };

  const breadcrumbDefault = [{ key: props.webpart.url, text: "Home", onClick: onBreadcrumbClick }];

  React.useEffect(() => {
    breadcrumb.current = breadcrumbDefault;
    setUrl(props.webpart.url);
  }, [props.webpart.url])

  React.useEffect(() => {

    if (!url) return;

    sp.web.getFileByUrl(url).getText().then(async (content) => {

      const init: Partial<IDiagramInfo> = {
        enableZoom: props.webpart.enableZoom,
        enablePan: props.webpart.enablePan,
        enableLinks: props.webpart.enableLinks
      };

      contextRef.current = new SvgPublishContext(ref.current, content, init);
      contextRef.current.events.addEventListener('linkClicked', onLinkClicked);
      setError('');
    }, err => {
      Errors.formatErrorMessage(err)
        .then(message => setError(`Unable to get file ${decodeURI(url)}. ${message}`))
        .catch(err => setError(`Unable to get file ${decodeURI(url)} ${err}`))
    });

    return () => {
      if (contextRef.current) {
        contextRef.current.events.removeEventListener('linkClicked', onLinkClicked);
        contextRef.current.destroy();
        contextRef.current = null;
      }
    };

  }, [url]);

  React.useEffect(() => contextRef.current?.services?.view?.reset(), [props.webpart.width, props.webpart.height]);
  React.useEffect(() => contextRef.current?.services?.view?.setPanEnabled(props.webpart.enablePan), [props.webpart.enablePan]);
  React.useEffect(() => contextRef.current?.services?.view?.setZoomEnabled(props.webpart.enableZoom), [props.webpart.enableZoom]);
  React.useEffect(() => contextRef.current?.enableService('links', props.webpart.enableLinks), [props.webpart.enableLinks]);

  const breadcrumb = React.useRef<IBreadcrumbItem[]>(breadcrumbDefault);

  const onLinkClicked = (evt: LinkClickedEvent) => {

    evt.preventDefault();

    const args = evt.args;
    const link = args.link;

    const pageId = link.PageId;
    if (pageId >= 0) {
      const diagram = evt.args.context.diagram;
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
  }

  const [error, setError] = React.useState('');

  const showPlaceholder = !url || error;

  const rootStyle: React.CSSProperties = {
    height: props.webpart.height,
    width: props.webpart.width,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  };

  const divStyle = {
    flexGrow: 1
  };

  return (
    <ThemeProvider style={rootStyle}>
      {props.webpart.enableBreadcrumb && <Breadcrumb styles={{ root: { margin: 0 }}} items={breadcrumb.current} />}
      {showPlaceholder && <ErrorPlaceholder context={props.context} isRoot={url === props.webpart.url} isReadOnly={props.isReadOnly} error={error} />}
      <div style={divStyle} ref={ref} />
    </ThemeProvider>
  );
}
