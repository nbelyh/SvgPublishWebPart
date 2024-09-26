import { WebPartContext } from '@microsoft/sp-webpart-base';
import { IDefaultFolder } from './IDefaultFolder';
import { sp } from '@pnp/sp';

export class Defaults {

  public static selectColor = 'rgba(255, 255, 0, 0.8)';
  public static hoverColor = 'rgba(255, 255, 0, 0.2)';
  public static hyperlinkColor = 'rgba(0, 0, 255, 0.2)';

  private static defaultFolder: IDefaultFolder;
  public static async getDefaultFolder(context: WebPartContext): Promise<IDefaultFolder> {
    if (this.defaultFolder) {
      return this.defaultFolder;
    }

    const teamsContext = context.sdks?.microsoftTeams?.context;
    if (teamsContext) {
      return this.defaultFolder = {
        name: teamsContext.channelName,
        relativeUrl: teamsContext.channelRelativeUrl
      };
    }

    try {
      const lists = await sp.web.lists.select('DefaultViewURL', 'Title').filter('BaseTemplate eq 101 and Hidden eq false').get();
      const firstList = lists[0];
      if (firstList) {
        const webUrl = context.pageContext.web.serverRelativeUrl;
        let viewUrl = firstList.DefaultViewUrl;
        if (viewUrl.startsWith(webUrl))
          viewUrl = viewUrl.substring(webUrl.length);

        const pos = viewUrl.indexOf("/Forms/");
        if (pos >= 0) {
          const docLibPath = viewUrl.substring(0, pos);
          return this.defaultFolder = {
            name: firstList.Title,
            relativeUrl: `${webUrl}${docLibPath}`
          }
        }
      }
    } catch (err) {
      console.warn('Unable to dtermine default folder using default', err);
    }

    return this.defaultFolder = {
      name: undefined,
      relativeUrl: undefined
    };
  }

  private static defaultWidth;
  public static async getDefaultWidth(context: WebPartContext) {
    context;
    if (this.defaultWidth) {
      return this.defaultWidth;
    }

    return this.defaultWidth = '100%';
  }

  private static defaultHeight;
  public static async getDefaultHeight(context: WebPartContext) {

    if (this.defaultHeight) {
      return this.defaultHeight;
    }

    if (context.sdks.microsoftTeams) {
      return this.defaultHeight = '100%';
    }

    const pageContext = context.pageContext;
    if (pageContext?.list?.id && pageContext?.listItem?.id) {
      try {
        const item = await sp.web.lists.getById(pageContext.list.id.toString()).items.getById(pageContext.listItem.id).select('PageLayoutType').get();
        if (item['PageLayoutType'] === 'SingleWebPartAppPage') {
          return this.defaultHeight = '100%';
        }
      } catch (err) {
        console.warn('Unable to dtermine default height using default', err);
      }
    }
    return this.defaultHeight = '50vh';
  }

}
