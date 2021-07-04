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
};

const calcRemTime = (time) => {
  return +time - new Date().getTime();
};
