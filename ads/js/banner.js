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
  childEle.style.display = "inline-block";
  parent.appendChild(childEle);

  // Get ad element
  const ad_widget = document.getElementById(idName);

  // Fetch API
  fetchAd(token)
    .then((res) => {
      res = res.ads;
      let html = "";

      for (let i in res) {
        let rel = "";
        if (res[i].rel == 0) rel = " rel='nofollow'";
        if (res[i].rel == 2) rel = " rel='nofollow noreferrer noopener'";

        html += `
        <div
        style="
          position: relative;
          width: auto;
          height: auto;
          padding: 0;
          margin: 0;
          border: none;
          box-sizing: border-box;
          display: inline-block;
        "
      >
        <a
          target="_blank"
          style="display: inline-block"
          ${rel}
          href="${res[i].process}"
          ><img
            src="${res[i].banner}"
            alt="${res[i].title}"
            style="position: relative" /></a
        ><a target="_blank" href="https://www.adtol.com"
          ><img
            src="https://www.adtol.com/images/adchoices.svg"
            alt="ad"
            title="Ads by AdTol.com"
            style="position: absolute; top: 0; right: 0; width: 16px"
        /></a>
      </div>
        `;
      }

      ad_widget.innerHTML = html;
    })
    .catch((err) => {
      console.log(err);
    });
}
