# DRGCDropin
DRGCDropin is a JavaScript library for utilizing Drop-in to complete a payment on a GC hosted site. You don't need to take care of grabbing the payment session identifier to instantiate Drop-in or attaching the source by using Commerce API. You can simply use the library's function to create Drop-in and place it on the page. Once a source is successfully created, you can attach the source to the cart by using the `applyPaymentToCart()` function.

## Usage
#### Step 1: Include DigitalRiver.js on your page
```html
<script src="https://js.digitalriverws.com/v1/DigitalRiver.js"></script>
```
#### Step 2: Include the base Drop-in CSS file
```html
<link rel="stylesheet" href="https://js.digitalriverws.com/v1/css/DigitalRiver.css" type="text/css"/>
```
#### Step 3: Include the library on your page
```html
<script src="dist/drgc-dropin.js"></script>
```
#### Step 4: Initialize DigitalRiver.js with your public key
#### Step 5: Initialize Drop-in by passing the parameters using the `init()` function
#### Step 6: Use the `createDropin()` function to create an instance of Drop-in
#### Step 7: Place Drop-in on the page by using the `mount()` function

## Examples

```javascript
$(async function() {
  const digitalriverJs = new DigitalRiver('YOUR_PUBLIC_API_KEY', {
    'locale': '<str:replace replace="_" with="-"><bean:write name="page" property="user.locale" /></str:replace>'
  });

  const billingAddress = {
    firstName: '<bean:write name="req" property="billToAddress.name1" />',
    lastName: '<bean:write name="req" property="billToAddress.name2" />',
    email: '<bean:write name="req" property="billToAddress.email" />',
    phoneNumber: '<bean:write name="req" property="billToAddress.phoneNumber" />',
    address: {
      line1: '<bean:write name="req" property="billToAddress.line1" />',
      line2: '><bean:write name="req" property="billToAddress.line2" />',
      city: '<bean:write name="req" property="billToAddress.city" />',
      state: '<bean:write name="req" property="billToAddress.state" />',
      postalCode: '<bean:write name="req" property="billToAddress.postalCode" /><logic:notEmpty name="req" property="billToAddress.plusFourCode">-<bean:write name="req" property="billToAddress.plusFourCode" /></logic:notEmpty>',
      country: '<bean:write name="req" property="billToAddress.country" />'
    }
  };

  const successCallback = async function(res) {
    if (res.source.state === 'chargeable' || res.source.state === 'pending_funds') {
      try {
        await DRGCDropin.applyPaymentToCart(res.source.id);
        // Assume that Drop-in is placed on the confirmOrder page
        document.forms.CheckoutConfirmOrderForm.submit();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const errorCallback = function(res) {
    console.error(res.errors);
  };

  const readyCallback = function(res) {
    if (!res.paymentMethodTypes.length) {
      console.error('No payment methods!');
    }
  };

  const cancelCallback = function(res) {};

  await DRGCDropin.init({
    siteId: '<bean:write name="page" property="site.siteID" />',
    apiKey: 'YOUR_PUBLIC_API_KEY',
    digitalriverJs: digitalriverJs,
    billingAddress: billingAddress,
    options: {
      showComplianceSection: true,
      showTermsOfSaleDisclosure: true,
      button: {
        type: 'submitOrder'
      }
    },
    paymentMethodConfiguration: {
      enabledPaymentMethods: ['creditCard']
    },
    successCallback: successCallback,
    errorCallback: errorCallback,
    readyCallback: readyCallback,
    cancelCallback: cancelCallback
  });

  DRGCDropin.createDropin();
  DRGCDropin.mount('YOUR_DROPIN_CONTAINER_ID');
});
```
