import { advertisingQuotes } from "../constants/common";

export const validAuthToken = () => {
  // Check if token in localstorge
  const token = localStorage.getItem("authToken");
  const expiration = localStorage.getItem("expiration");

  if (token) {
    // Calculate remaining time
    let remainingTime = calcRemTime(expiration);

    if (remainingTime < 60000) return false;
    return remainingTime;
  }

  return false;
};

export const parseAuthToken = () => {
    const token = localStorage.getItem("authToken");
    return JSON.parse(atob(token.split(".")[1]));
}

export const removeToken = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("expiration");
    localStorage.removeItem("hideUserStatusNotification");
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
  if(!date) return;
  const pastDate = Math.floor(new Date(date).getTime() / 1000);
  const todayDate = new Date().toISOString().slice(0, 10);
  const today = Math.floor(new Date(todayDate).getTime() / 1000);

  const days = Math.floor((today - pastDate) / 86400);

  const daysPast = days < 10 ? days:10;

  document.getElementById("root").style.opacity =  (1 - (daysPast / 10).toFixed(1));
}