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
          background: #fff;
          width: 300px;
          height: 250px;
          border-radius: 2px;
          padding: 0;
          box-sizing: border-box;
          margin: 0.5rem;
          overflow: hidden;
          box-shadow: 0 2px 5px 0 rgba(211, 209, 238, 0.5);
        "
      >
        <div style="display:block;background:#ccc;width:300px;height:150px">
          <a
            target="_blank"
            style="display:flex;width:300px;height:150px;justify-content:center"
            ${rel}
            href="${res[i].process}"
            ><img
              style="height:100%;width:100%"
              src="${res[i].banner}"
              alt="${res[i].title}"
          /></a>
        </div>
        <div
          style="
            padding: 0.25rem 0.5rem;
            height: 55px;
            font-weight: 600;
            box-sizing: border-box;
            overflow: hidden;
          "
        >
          <a
            target="_blank"
            style="font-size:16px;display:inline-block;text-decoration:none;overflow:hidden;text-overflow:ellipsis;line-height:24px"
            href="${res[i].process}"
            >${res[i].title}</a
          >
        </div>
        <div style="display:flex;justify-content:space-between;align-items:baseline;padding:0.25rem 0.5rem;height:45px">
          <div
            style="
              display:inline-block;
              font-size: 16px;
              color: #A0A0A0;
              max-width: 180px;
              overflow: hidden;
              font-weight:600;
            "
          >
          ${res[i].domain}
          </div>
          <div style="display:inline-block;">
            <a
              target="_blank"
              style="display:inline-block"
              ${rel}
              href="${res[i].process}"
              ><button
                style="
                  background: #4d4dff;
                  border:none;
                  color:#fff;
                  font-weight:600;
                  border-radius: 4px;
                  padding: 8px 16px;
                  cursor:pointer;
                  box-shadow: 0 2px 5px 0 rgba(211, 209, 238, 0.5);
                "
              >
              ${res[i].btn}
              </button></a
            >
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
