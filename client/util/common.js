import { advertisingQuotes } from "../constants/common";

export const validAuthToken = () => {
  // Check if token in localstorge
  let token, expiration;
  if(process.browser) {
    token = window.localStorage.getItem("authToken");
    expiration = window.localStorage.getItem("expiration");
  }

  if (token) {
    // Calculate remaining time
    let remainingTime = calcRemTime(expiration);

    if (remainingTime < 60000) return false;
    return remainingTime;
  }

  return false;
};

export const parseAuthToken = () => {
  if(process.browser) {
    const token = window.localStorage.getItem("authToken");
    try {
      const userData = JSON.parse(atob(token.split(".")[1]));
      return userData;
    }
    catch (err) {
      return null;
    }
  }
}

export const removeToken = () => {
  if(process.browser) {
    window.localStorage.removeItem("authToken");
    window.localStorage.removeItem("expiration");
    window.localStorage.removeItem("hideUserStatusNotification");
  }
};

const calcRemTime = (time) => {
  return +time - new Date().getTime();
};

const intlFormat = (num) => {
  return new Intl.NumberFormat().format(Math.round(num*10)/10);
}

export const makeFriendly = (num) => {
  if(num >= 1000000)
    return intlFormat(num/1000000)+'M';
  if(num >= 1000)
    return intlFormat(num/1000)+'k';
  return intlFormat(num);
}

export const getAdQuote = () => {
  const count = (advertisingQuotes.length - 1);
  const rand = Math.floor(Math.random() * count);

  return advertisingQuotes[rand].split('-').map(i => i.trim());
}

export const setOpacity = (date) => {
  if(!process.browser) return null;

  if(!date) return;
  const url = new URL(window.location.href);
  if(url.hostname != 'adtol.com' && url.hostname != 'www.adtol.com') return;
  const pastDate = Math.floor(new Date(date).getTime() / 1000);
  const todayDate = new Date().toISOString().slice(0, 10);
  const today = Math.floor(new Date(todayDate).getTime() / 1000);

  const days = Math.floor((today - pastDate) / 86400);

  const daysPast = days < 10 ? days:10;

  document.getElementById("root").style.opacity =  (1 - (daysPast / 10).toFixed(1));
}

export const getCookie = (name) => {
  if(!process.browser) return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

export const createCookie = (name, value, days) => {
  if(!process.browser) return null;

  let expires;
  if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (+days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toGMTString();
  }
  else {
      expires = "";
  }
  document.cookie = name + "=" + value + expires + "; path=/";
}
