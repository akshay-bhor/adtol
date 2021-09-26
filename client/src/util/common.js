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