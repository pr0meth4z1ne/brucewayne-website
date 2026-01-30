// $BRUCE — minimal JS (copy CA, smoother marquee, year)
(function () {
  // Year
  var y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());

  // Copy contract address (placeholder safe)
  var btn = document.getElementById("copyCa");
  var hint = document.getElementById("copyHint");

  function setHint(msg) {
    if (!hint) return;
    hint.textContent = msg;
    window.clearTimeout(setHint._t);
    setHint._t = window.setTimeout(function () {
      hint.textContent = "";
    }, 1600);
  }

  if (btn) {
    btn.addEventListener("click", async function () {
      var ca = btn.getAttribute("data-ca") || btn.textContent.trim();
      if (!ca || ca === "TBD_AT_LAUNCH") {
        setHint("CA drops at launch.");
        return;
      }
      try {
        await navigator.clipboard.writeText(ca);
        setHint("Copied.");
      } catch (e) {
        try {
          var ta = document.createElement("textarea");
          ta.value = ca;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          document.body.removeChild(ta);
          setHint("Copied.");
        } catch (e2) {
          setHint("Copy failed.");
        }
      }
    });
  }
  // Generic copy buttons (data-copy)
  function attachGenericCopy() {
    var nodes = document.querySelectorAll("[data-copy]");
    if (!nodes || !nodes.length) return;

    nodes.forEach(function (node) {
      node.addEventListener("click", async function () {
        var val = node.getAttribute("data-copy") || "";
        var status = null;

        // Try to find a nearby status element
        var card = node.closest(".contract-card");
        if (card) status = card.querySelector(".copy-status");

        function flash(msg) {
          if (!status) return;
          status.textContent = msg;
          window.clearTimeout(flash._t);
          flash._t = window.setTimeout(function () {
            status.textContent = "";
          }, 1600);
        }

        if (!val || val === "TBD_AT_LAUNCH") {
          flash("CA drops at launch.");
          return;
        }

        try {
          await navigator.clipboard.writeText(val);
          flash("Copied.");
        } catch (e) {
          try {
            var ta = document.createElement("textarea");
            ta.value = val;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand("copy");
            document.body.removeChild(ta);
            flash("Copied.");
          } catch (e2) {
            flash("Copy failed.");
          }
        }
      });
    });
  }
  attachGenericCopy();
  // Topbar CA copy (minimal feedback)
  var topBtn = document.getElementById("copyCaTop");
  if (topBtn) {
    topBtn.addEventListener("click", async function () {
      var ca = topBtn.getAttribute("data-ca") || "";
      if (!ca || ca === "TBD_AT_LAUNCH") {
        var old = topBtn.textContent;
        topBtn.textContent = "CA: AT LAUNCH";
        window.setTimeout(function () {
          topBtn.textContent = old;
        }, 1100);
        return;
      }
      try {
        await navigator.clipboard.writeText(ca);
        var old2 = topBtn.textContent;
        topBtn.textContent = "COPIED";
        window.setTimeout(function () {
          topBtn.textContent = old2;
        }, 1100);
      } catch (e) {
        // ignore
      }
    });
  }

  // Marquee: repeat content until it overfills the viewport (so there is never empty space)
  var track = document.getElementById("ticker");
  function fillMarquee() {
    if (!track) return;

    // Reset to the original set (first half) by taking the first 4 chips if possible
    // (Your HTML contains repeated chips already — this keeps it stable.)
    var original = track.getAttribute("data-original");
    if (!original) {
      original = track.innerHTML;
      track.setAttribute("data-original", original);
    }
    track.innerHTML = original;

    // Keep appending until we have plenty of width
    var safety = 0;
    while (track.scrollWidth < window.innerWidth * 2.5 && safety < 20) {
      track.innerHTML += original;
      safety++;
    }
  }

  fillMarquee();
  window.addEventListener("resize", function () {
    // tiny debounce
    window.clearTimeout(fillMarquee._t);
    fillMarquee._t = window.setTimeout(fillMarquee, 120);
  });
})();
