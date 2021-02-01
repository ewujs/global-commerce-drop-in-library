import {ajax} from './ajax';

const subdomain = window.location.hostname.split('.')[0];
const testEnv = ['cte', 'pte', 'lte'].find(element => subdomain.indexOf(element) !== -1);
let apiDomain = '';

if (testEnv === undefined) {
  apiDomain = (subdomain.indexOf('sys') !== -1) ? 'dispatch-test.digitalriver.com' : 'api.digitalriver.com';
} else {
  apiDomain = `dispatch-${testEnv}.digitalriverws.net`;
}

export const createLimitedAccessTokenByPk = async (siteId, pk) => {
  if (typeof siteId !== 'string') {
    throw new Error('Please pass the site ID.');
  }

  if (typeof pk !== 'string') {
    throw new Error('Please pass a public API Key.');
  }

  try {
    const tokenData = await ajax({
      url: `https://${window.location.hostname}/store/${siteId}/SessionToken?apiKey=${pk}`,
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    })
    .send()
    .then(res => res)
    .catch((e) => {
      throw Error(e);
    });

    return tokenData;
  } catch (e) {
    throw Error(e);
  }
};

export const getPaymentSession = async (siteId, pk) => {
  if (typeof siteId !== 'string') {
    throw new Error('Please pass the site ID.');
  }

  if (typeof pk !== 'string') {
    throw new Error('Please pass a public API Key.');
  }

  try {
    const tokenData = await createLimitedAccessTokenByPk(siteId, pk);
    const accessToken = JSON.parse(tokenData).access_token;
    const cartData = await ajax({
      url: `https://${apiDomain}/v1/shoppers/me/carts/active.json?fields=paymentSession`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    .send()
    .then(res => res)
    .catch((e) => {
      throw Error(e);
    });

    const paymentSession = JSON.parse(cartData).cart.paymentSession;

    if (paymentSession && paymentSession.id) {
      return paymentSession;
    } else {
      throw new Error('Please make the payment session is enabled for the site.');
    }
  } catch (e) {
    console.error(e);
  }
};

export const applyPaymentMethod = async (siteId, pk, sourceId) => {
  if (typeof siteId !== 'string') {
    throw new Error('Please pass the site ID.');
  }

  if (typeof pk !== 'string') {
    throw new Error('Please pass a public API Key.');
  }

  if (typeof sourceId !== 'string') {
    throw new Error('Please pass the payment source ID');
  }

  try {
    const tokenData = await createLimitedAccessTokenByPk(siteId, pk);
    const accessToken = JSON.parse(tokenData).access_token;
    const cartData = await ajax({
      url: `https://${apiDomain}/v1/shoppers/me/carts/active/apply-payment-method.json`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      data: {
        paymentMethod: {
          sourceId: sourceId
        }
      }
    })
    .send()
    .then(res => res)
    .catch((e) => {
      throw Error(e);
    });

    return cartData;
  } catch (e) {
    console.error(e);
  }
};
