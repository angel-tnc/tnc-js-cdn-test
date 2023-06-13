// <script type='text/javascript' src='/assets/built/cookie-banner.js'></script>

// Template literals may be best not used for extra broad support
function _tncSetCookie(name, value, expireDays) {
    let expireDate = new Date();
    expireDate.setTime(expireDate.getTime() + (expireDays*24*60*60*1000));
    if (value === undefined) {
      value = '';
    }
    let expiresString = expireDate.toUTCString();
    let encodedValue = encodeURIComponent(value);
    document.cookie = `${name}=${encodedValue};expires=${expiresString};path=/;Secure`;
}

function _tncGetCookie(name) {
    let cookieName = name + '=';
    let decodedCookie = decodeURIComponent(document.cookie);
    let cookieArray = decodedCookie.split(';');
    for(let i = 0; i <cookieArray.length; i++) {
      let c = cookieArray[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(cookieName) == 0) {
        return c.substring(cookieName.length, c.length);
      }
    }
    return '';
}

function _tncRemoveCookie(name) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;Secure`;
}

function getGa4MeasurementId() {
  let cookieConsentScript = document.getElementById('cookie-consent-script');
  if (cookieConsentScript) {
    return cookieConsentScript.getAttribute('data-ga4-measurement-id');
  }
}

function insertGtagScriptElement(measurementId) {
  let gtagUrl = 'https://www.googletagmanager.com/gtag/js';
  let script = document.createElement("script");
  script.async = true;
  script.src = `${gtagUrl}?id=${measurementId}`;
  // nonce is used for Content Security Policy see https://developers.google.com/tag-platform/tag-manager/web/csp
  // if (nonce) {
  //   script.setAttribute("nonce", nonce);
  // }
  document.body.appendChild(script);
}

function initializeGoogleAnalytics() {
  let measurementId = getGa4MeasurementId();
  if (!measurementId) {
    return;
  }
  insertGtagScriptElement(measurementId);
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', measurementId);
}

function hideCookieBanner() {
  let cookieBanner = document.getElementById('cookie-consent-banner');
  cookieBanner.style.display = 'none';
}

function prepareCookieConsentButtons() {
  let acceptButton = document.getElementById('cookie-confirm-button');
  let declineButton = document.getElementById('cookie-decline-button');
  acceptButton.addEventListener('click', function() {
    _tncSetCookie('CookieConsent', 'true', 365);
    initializeGoogleAnalytics();
    hideCookieBanner();
  });
  declineButton.addEventListener('click', function() {
    _tncSetCookie('CookieConsent', 'false', 365);
    hideCookieBanner();
  })
}

function checkConsentCookie() {
  let consentValue = _tncGetCookie('CookieConsent');
  let cookieBanner = document.getElementById('cookie-consent-banner');
  if (consentValue === 'true') {
    initializeGoogleAnalytics();
    cookieBanner.remove();
  } else if (consentValue === 'false') {
    cookieBanner.remove();
  } else {
    _tncRemoveCookie('CookieConsent');
    prepareCookieConsentButtons();
    cookieBanner.style.display = 'flex';
  }
}

window.addEventListener('load', checkConsentCookie);