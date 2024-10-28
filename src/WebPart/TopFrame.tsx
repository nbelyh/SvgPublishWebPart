import * as React from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { IWebPartProps } from "./IWebPartProps";
import { BlankPlaceholder } from './components/BlankPlaceholder';
import { ActionButton, Breadcrumb, IBreadcrumbItem, IconButton, Stack, ThemeProvider, TooltipHost } from '@fluentui/react';
import { SvgPublishComponent, LinkClickedEvent } from 'svgpublish-react';
import { stringifyError } from './Errors';
import { ErrorPlaceholder } from './components/ErrorPlaceholder';
import { UsageLogService } from './services/UsageLogService';

const isUrlAbsolute = (url: string) => url.indexOf('://') > 0 || url.indexOf('//') === 0;

const officeExtensions = new Set([
  'doc', 'docx', 'dot', 'dotx', // Word
  'xls', 'xlsx', 'xlsm', 'xltx', 'xltm',  // Excel
  'ppt', 'pptx', 'pps', 'ppsx', 'pot', 'potx', // PowerPoint
  'pub', // Publisher
  'vsd', 'vsdx', // Visio
  'odt', 'ods', 'odp', // OpenDocument Text/Spreadsheet/Presentation
  'rtf' // Rich Text Format
]);

const isOfficeFileExtension = (url: string) => {
  const extension = url.split('.').pop().toLowerCase().split(/#|\?/)[0];
  return officeExtensions.has(extension);
}

export function TopFrame(props: {
  context: WebPartContext;
  webpart: IWebPartProps;
  isReadOnly: boolean;
}) {

  const params = new URLSearchParams(window.location.search);
  const paramsUrl = params.get('svgpublish-url');
  const defaultUrl = paramsUrl || props.webpart.url;
  const [url, _setUrl] = React.useState<string>(defaultUrl);

  const setUrl = (url: string) => {
    _setUrl(url);
    if (props.webpart.enableUsageLog) {
      UsageLogService.logUrl(url, props.webpart.usageLogListTitle);
    }
  }

  const onBreadcrumbClick = (ev?: React.MouseEvent<HTMLElement>, item?: IBreadcrumbItem) => {
    setBreadcrumb(b => b.slice(0, b.findIndex(i => i.key === item.key) + 1));
    setUrl(item.key);
    setError('');
  };

  const [breadcrumb, setBreadcrumb] = React.useState<IBreadcrumbItem[]>(defaultUrl ? [{ key: defaultUrl, text: "Home", onClick: onBreadcrumbClick }] : []);

  React.useEffect(() => {
    setUrl(defaultUrl);
    setBreadcrumb([{ key: defaultUrl, text: "Home", onClick: onBreadcrumbClick }]);
  }, [defaultUrl]);

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

      let linkAddress = link.Address;

      if (linkAddress) {

        if (props.webpart.rewriteVsdxHyperlinks && linkAddress.endsWith('.vsdx')) {
          linkAddress = linkAddress.replace('.vsdx', '.svg');
        }
        if (props.webpart.rewriteDocxHyperlinks && linkAddress.endsWith('.docx')) {
          linkAddress = linkAddress.replace('.docx', '.pdf');
        }

        if (!linkAddress.startsWith('https:') && linkAddress.endsWith('.svg')) { // another local diagram
          const pageUrl = url.substring(0, url.lastIndexOf('/') + 1) + linkAddress;
          setBreadcrumb(b => [...b, { key: pageUrl, text: args.shape.Text, onClick: onBreadcrumbClick }]);
          setUrl(pageUrl);
        } else {

          if (props.webpart.enableUsageLog) {
            UsageLogService.logUrl(linkAddress, props.webpart.usageLogListTitle);
          }

          const fileUrl = isUrlAbsolute(linkAddress)
            ? new URL(linkAddress)
            : new URL(linkAddress, url.substring(0, url.lastIndexOf('/') + 1));

          if (props.webpart.forceOpeningOfficeFilesOnline && isOfficeFileExtension(linkAddress)) {
            fileUrl.searchParams.append('web', '1');
          }
          const target = props.webpart.openHyperlinksInNewWindow ? '_blank' : '_self';
          window.open(fileUrl, target);
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

  // const pageContext = props.context.pageContext;

  const pageUrl = React.useMemo(() => {
    const pageUrl = new URL(window.location.href);
    pageUrl.searchParams.delete('svgpublish-url');
    pageUrl.searchParams.append('svgpublish-url', url);
    return pageUrl.toString();
  }, [url]);

  const formattedFeedbackUrl = React.useMemo(() => {
    const feedbackUrl = props.webpart.feedbackUrl || '';
    const result = feedbackUrl.replace('{{URL}}', pageUrl);
    return result;
  }, [props.webpart.feedbackUrl, pageUrl]);

  const feedbackButtonText = props.webpart.feedbackButtonText || 'Feedback';
  const feeedbackButtonTarget = '_blank';

  const [hashLinkTooltip, setHashLinkTooltip] = React.useState('Copy WebPart Link');

  const onCopyHashLink = async () => {
    await navigator.clipboard.writeText(pageUrl);
    setHashLinkTooltip('Link copied!');
    setTimeout(() => setHashLinkTooltip('Copy WebPart Link'), 2000);
  }

  return (
    <ThemeProvider style={rootStyle}>
      {props.webpart.enableHeader &&
        <Stack horizontal>
          {props.webpart.enableBreadcrumb &&
          <Stack.Item grow>
            <Breadcrumb styles={{ root: { margin: 0 }}} items={breadcrumb} />
          </Stack.Item>}
          {props.webpart.enableCopyHashLink && <Stack.Item align='center'>
            <TooltipHost content={hashLinkTooltip}>
              <IconButton iconProps={{ iconName: 'PageLink' }} title='Copy WebPart Link' onClick={onCopyHashLink} />
            </TooltipHost>
          </Stack.Item>}
          {props.webpart.enableFeedback && <Stack.Item align='center'>
            <ActionButton target={feeedbackButtonTarget} href={formattedFeedbackUrl}>{feedbackButtonText}</ActionButton>
          </Stack.Item>}
        </Stack>
      }
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
        selectionColor={props.webpart.selectionColor}
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
