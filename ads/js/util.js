const baseURL = "https://dev.adtol.com";

const randomId = (length) => {
  let result = [];
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result.push(
      characters.charAt(Math.floor(Math.random() * charactersLength))
    );
  }
  return result.join("");
};

const isHidden = (el) => {
  var style = window.getComputedStyle(el);
  return (
    style.display === "none" ||
    style.height == 0 ||
    style.visibility == "hidden" ||
    style.opacity < 0.5
  );
};

export { randomId, isHidden, baseURL };
