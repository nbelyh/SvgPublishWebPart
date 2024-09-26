
export function stringifyError(err: any) {
  if (typeof err === 'string')
    return err;
  if (typeof err === 'object') {
    if (typeof err.error === 'object') {
      return stringifyError(err.error);
    } else if (typeof err.response === 'object' && typeof err.response.toJSON === 'function') {
      return stringifyError(err.response.toJSON()?.body);
    } else {
      return err?.['odata.error']?.message?.value
        ?? err.error_description
        ?? err.error_message
        ?? err.message
        ?? err.error
        ?? JSON.stringify(err);
    }
  }
}
