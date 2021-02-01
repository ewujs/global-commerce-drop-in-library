import {getPaymentSession, applyPaymentMethod} from './api';

(function(window) {
  let dropin = null;

  const init = async (params) => {
    const {
      siteId,
      apiKey,
      digitalriverJs,
      billingAddress = {},
      options = {},
      paymentMethodConfiguration = {},
      successCallback,
      errorCallback,
      readyCallback,
      cancelCallback
    } = params || {};

    if (typeof siteId !== 'string') {
      throw new Error('Please pass the site ID.');
    }

    if (typeof apiKey !== 'string') {
      throw new Error('Please pass a public API key.');
    }

    if (typeof digitalriverJs !== 'object') {
      throw new Error('Please pass an instance of the DigitalRiver.js object.');
    }

    if (Object.keys(billingAddress).length === 0) {
      throw new Error('Please pass the billing address object.');
    }

    try {
      const paymentSession = await getPaymentSession(siteId, apiKey);
      const paymentSessionId = paymentSession.id;
      const config = {
        sessionId: paymentSessionId,
        billingAddress: billingAddress,
        options: options,
        paymentMethodConfiguration: paymentMethodConfiguration,
        onSuccess: successCallback,
        onError: errorCallback,
        onReady: readyCallback,
        onCancel : cancelCallback
      };

      DRGCDropin.siteId = siteId;
      DRGCDropin.apiKey = apiKey;
      DRGCDropin.digitalriverJs = digitalriverJs;
      DRGCDropin.config = config;
    } catch (error) {
      throw Error(error);
    }
  };

  const createDropin = () => {
    try {
      dropin = DRGCDropin.digitalriverJs.createDropin(DRGCDropin.config);
    } catch (error) {
      throw Error(error);
    }
  };

  const mount = (id) => {
    if (typeof id !== 'string') {
      throw new Error('Please pass the element ID.');
    }

    if (!dropin) throw new Error('Please create an instance of Drop-in before placing it on the page.');

    try {
      dropin.mount(id);
    } catch (error) {
      throw Error(error);
    }
  };

  const applyPaymentToCart = async (sourceId) => {
    if (typeof sourceId !== 'string') {
      throw new Error('Please pass the payment source ID.');
    }

    try {
      const cartData = await applyPaymentMethod(DRGCDropin.siteId, DRGCDropin.apiKey, sourceId);
      return cartData;
    } catch (error) {
      throw Error(error);
    }
  };

  window.DRGCDropin = {
    siteId: '',
    apiKey: '',
    digitalriverJs: {},
    config: {},
    init: init, 
    createDropin: createDropin,
    mount: mount,
    applyPaymentToCart: applyPaymentToCart
  };
})(window);