// 14 Nov 2026: remember where a visitor first came from, so that if they later sign up, their member record keeps the
// source (ads rule, 8 Nov: cost per paying member by channel). Our links carry ?ref=<channel>; ads carry
// utm_source / utm_medium / utm_campaign. Only the first tagged visit (or the first visit sent by another site) is kept.
// It stays in this browser only; the members page hands it over once, at the first sign-in. No cookies, nothing personal.
(function () {
  try {
    var K = "pvx-first-ref";
    if (localStorage.getItem(K)) return;
    var q = new URLSearchParams(location.search);
    var clean = function (s, n) { return String(s || "").toLowerCase().replace(/[^a-z0-9._-]/g, "").slice(0, n); };
    var ref = clean(q.get("ref"), 40), camp = clean(q.get("utm_campaign"), 60), from = "";
    if (!ref && q.get("utm_source")) {
      var med = clean(q.get("utm_medium"), 12);   // ads: utm_medium={{site_source_name}} gives fb / ig / msg / an
      ref = clean(q.get("utm_source"), 27) + (med ? "-" + med : "");
    }
    if (!ref && document.referrer) {
      var h = new URL(document.referrer).hostname.toLowerCase().replace(/^www\./, "");
      if (h && h.indexOf("provenexa") < 0) from = h.replace(/[^a-z0-9.-]/g, "").slice(0, 80);
    }
    if (!ref && !from) return;   // a plain direct visit locks nothing: a later tagged visit can still fill it
    localStorage.setItem(K, JSON.stringify({ref: ref, c: camp, from: from,
      d: new Date(Date.now() + 330 * 60000).toISOString().slice(0, 10)}));
  } catch (e) {}
})();
