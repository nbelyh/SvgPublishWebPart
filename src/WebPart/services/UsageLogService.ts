import { sp } from '@pnp/sp';

import '@pnp/sp/webs';
import '@pnp/sp/lists';

export class UsageLogService {

  public static async logUrl(url: string, listTitle: string) {
    const added = await sp.web.lists.getByTitle(listTitle).items.add({
      Title: decodeURI(url),
    });
  }

}
