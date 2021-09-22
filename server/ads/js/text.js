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
  const token = currScript.getAttribute("id");

  // Create element
  let childEle = document.createElement("div");
  childEle.setAttribute("id", idName);
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
          background-color: #fff;
          border-radius: 2px;
          margin: 0.5rem;
          padding: 0.5rem;
          box-shadow: 0 2px 5px 0 rgba(211, 209, 238, 0.5);
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        "
      >
        <div>
          <a
            target="_blank"
            style="
              margin: 2px;
              padding: 2px;
              text-align: left !important;
              text-decoration: none;
            "
            ${rel}
            href="${res[i].process}"
          >
            <b>${res[i].title}</b></a
          >
        </div>
        <div style="color: #333; text-align: left !important">
          <a
            target="_blank"
            style="
              margin: 2px;
              padding: 2px;
              text-align: left !important;
              display: inline-block;
            "
            href="https://www.adtol.com"
          >
            <span
              style="
                background: green;
                display: inline-block;
                padding: 0 2px 0 2px;
                border-radius: 4px;
                color: #fff;
                font-size: 14px;
              "
              >Ad</span
            >
          </a>
          ${res[i].domain}
        </div>
        <div
          style="
            margin: 0px;
            padding: 2px;
            color: #777;
            text-align: left !important;
          "
        >
          ${res[i].desc}
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
