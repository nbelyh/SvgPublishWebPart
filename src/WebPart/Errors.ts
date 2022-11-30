export class Errors {

  public static async formatErrorMessage(e) {

    if (e.isHttpRequestError) {

      // get the response
      const data = await e.response.json();

      // fetch error code
      const message = typeof data["odata.error"] === "object" ? data["odata.error"]?.message?.value : `${e}`;

      return message;
    } else {
      return `${e}`;
    }
  }

}
