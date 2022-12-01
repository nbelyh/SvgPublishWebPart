import * as React from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { IWebPartProps } from "./IWebPartProps";
import { ThemeProvider } from '@fluentui/react';
import { sp } from '@pnp/sp';
import { ISvgPublishContext, LinkClickedEvent, SvgPublishContext } from 'svgpublish';
import { Errors } from './Errors';
import { ErrorPlaceholder } from './components/ErrorPlaceholder';

export function TopFrame(props: {
  context: WebPartContext;
  webpart: IWebPartProps;
  isReadOnly: boolean;
}) {

  const ref = React.useRef(null);
  const [url, setUrl] = React.useState<string>(props.webpart.url);

  const contextRef = React.useRef<ISvgPublishContext>(null);

  React.useEffect(() => setUrl(props.webpart.url), [props.webpart.url])

  React.useEffect(() => {

    if (!url) return;

    sp.web.getFileByUrl(url).getText().then(async (content) => {
      contextRef.current = SvgPublishContext.create(ref.current, content);
      contextRef.current.events.addEventListener('linkClicked', onLinkClicked);
      setError('');
    }, err => {
      Errors.formatErrorMessage(err)
        .then(message => setError(`Unable to get file ${url}: ${message}`))
        .catch(err => setError(`Unable to get file ${url}: ${err}`))
    });

    return () => {
      if (contextRef.current) {
        contextRef.current.events.removeEventListener('linkClicked', onLinkClicked);
        SvgPublishContext.destroy(contextRef.current);
        contextRef.current = null;
      }
    };

  }, [url]);

  React.useEffect(() => {
    if (contextRef.current) {
      const view = contextRef.current.services.view as any;
      view.reset();
    }
  }, [props.webpart.width, props.webpart.height])

  const onLinkClicked = (evt: LinkClickedEvent) => {

    evt.preventDefault();

    const link = evt.args.link;
    const pageId = link.PageId;
    if (pageId >= 0) {
      const diagram = evt.args.context.diagram;
      const page = diagram.pages.find(p => p.Id === pageId);
      const pageUrl = url.substring(0, url.lastIndexOf('/') + 1) + page.FileName;
      setUrl(pageUrl);
    } else {
      if (link.Address) {
        window.open(link.Address, '_blank');
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
      {showPlaceholder && <ErrorPlaceholder context={props.context} isReadOnly={props.isReadOnly} error={error} />}
      <div style={divStyle} ref={ref} />
    </ThemeProvider>
  );
}
