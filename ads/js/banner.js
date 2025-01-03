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

  // Get ref URL
  const ref_url = window.location.href;

  // Fetch API
  fetchAd(token)
    .then((res) => {
      const ads = res.ads;
      let html = "";

      for (let i in ads) {
        let rel = "";
        if (ads[i].rel == 0) rel = " rel='nofollow'";
        if (ads[i].rel == 2) rel = " rel='nofollow noreferrer noopener'";

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
          href="${ads[i].process}&ref=${ref_url}"
          ><img
            src="${ads[i].banner}"
            alt="${ads[i].title}"
            style="position: relative;max-width:100%!important;height:auto;" /></a
        ><a target="_blank"${rel} href="https://adtol.com"
          ><img
            src="${res.adchoices}"
            alt="ad"
            title="Ads by Adtol.com - The Best Ad Network for Publishers & Advertisers"
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
