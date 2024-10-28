
export class HashService {

  public static getUrlParameter(hash: string, name: string) {
    const regex = new RegExp(name + '=([^&#]*)');
    const results = regex.exec(hash);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }


}
