import fetchAd from "./fetch";
import { randomId, isHidden } from "./util";

// create a random class
const idName = randomId(6);

// Get parent
const currScript = document.currentScript;
const parent = currScript.parentNode;

// Check if parent is hidden
if (!isHidden(parent)) {
  // Get token
  const scriptId = currScript.getAttribute("id");
  const token = window[`adtol_ad_client_${scriptId}`];

  // Create element
  let childEle = document.createElement("div");
  childEle.setAttribute("id", idName);
  parent.appendChild(childEle);

  // Get ad element
  const ad_widget = document.getElementById(idName);

  let html = "";
  html += `<style>
  .adtol-feed-ad-container{display:flex;justify-content:space-around;flex-basis:320px;flex-direction:row;flex-wrap:wrap}
  @media(min-width:767px){.adtol-feed-ad-container{justify-content:left}}
  </style>`;
  childEle.setAttribute("class", 'adtol-feed-ad-container');

  // Fetch API
  fetchAd(token)
    .then((res) => {
      res = res.ads;

      for (let i in res) {
        let rel = "";
        if (res[i].rel == 0) rel = " rel='nofollow'";
        if (res[i].rel == 2) rel = " rel='nofollow noreferrer noopener'";

        html += `
        <div style="background:none!important;padding:0.5em;box-sizing:border-box">
        <div style="display:inline-block;width:320px;height:250px;overflow:hidden">
          <a target="_blank"
            style="display:block"
            ${rel}
            href="${res[i].process}"
            ><div style="position:relative;display:block">
              <img
                style="width:100%;height:175px"
                src="${res[i].banner}"
                alt="${res[i].title}"
              />
              <a target="_blank" href="https://www.adtol.com">
                <img
                    src="${res.adchoices}"
                    alt="ad"
                    title="Ads by AdTol.com"
                    style="position: absolute; top: 0; right: 0; width: 16px"
                /></a>
            </div>
          </a>
          <div style="display:block">
            <a style="display:inline-block;text-decoration:none!important;overflow:hidden;text-overflow:ellipsis;line-height:24px;height:48px"
              ${rel}
              target="_blank"
              href="${res[i].process}"
              >${res[i].title}</a
            >
            <div style="color:#a0a0a0;font-weight:600;font-size:90%">${res[i].domain}</div>
          </div>
        </div>
      </div>
        `;
      }

      ad_widget.innerHTML = html;
    })
    .catch((err) => {
      console.log(err);
    });
}
