import { get, CancelToken } from 'axios';
import { GATEWAY_URL } from 'util/constants';

const getsByHash = {};

/*
 * Better to use cat from util/ipfs module. It temporarily uses this, but will be updated
 * to get content from IPFS rather than a gatewate, once IPFS-JS is working better.
 */
export const getListing = hash => {
  if (typeof hash !== 'string' || !hash) {
    throw new Error('Please provide a listing hash as a non-empty string.');
  }

  let fetch = getsByHash[hash];

  if (!fetch) {
    const source = CancelToken.source();
    fetch = get(`${GATEWAY_URL}listing/ipfs/${hash}`, {
      cancelToken: source.token
    });
    fetch.then(() => delete getsByHash[hash]);
    // todo: maybe we wrap axios to infuse such a cancel method?
    fetch.cancel = msg => source.cancel(msg);
  }

  return fetch;
};
