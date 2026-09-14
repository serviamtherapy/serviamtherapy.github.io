/*
 * Serviam Therapy — Automatic Celebration Banner
 * Version 1.0
 * No external library required.
 *
 * Language is detected from <html lang="...">:
 *   he = Israeli + Jewish + international
 *   ru = Russian/CIS + international
 *   en = US + UK + international
 *
 * Test mode:
 *   Add ?celebration-test=1 to the page URL to show a test banner.
 */

(function () {
  "use strict";

  const CONFIG = {
    storageKey: "serviamCelebrationBannerDismissed",
    timeZone: "Asia/Jerusalem",
    showDaysBefore: 0,
    showDaysAfter: 0,
    testQuery: "celebration-test",
    bookingHref: "#booking"
  };

  const lang = (document.documentElement.lang || "he").toLowerCase().split("-")[0];
  const isRTL = lang === "he";

  /*
   * Fixed Gregorian celebrations.
   * Dates are month/day and therefore repeat every year.
   * "window" lets a message remain visible for several days.
   */
  const FIXED = {
    en: [
      {m:1,d:1, icon:"✨", title:"Happy New Year!", text:"Wishing you a new year filled with health, wellness and renewal.", window:1, regions:["international","us","uk"]},
      {m:2,d:14, icon:"♥", title:"Happy Valentine's Day", text:"A little time for yourself is always a good idea. Wishing you love, wellness and relaxation.", window:0, regions:["international","us","uk"]},
      {m:3,d:8, icon:"✦", title:"Happy International Women's Day", text:"Celebrating strength, wellbeing and the women who inspire us.", window:0, regions:["international","us","uk"]},
      {m:5,d:1, icon:"✦", title:"Happy May Day", text:"Wishing you a peaceful day and renewed energy.", window:0, regions:["international","uk"]},
      {m:7,d:4, icon:"🇺🇸", title:"Happy Independence Day", text:"Wishing our American friends a joyful Independence Day.", window:0, regions:["us"]},
      {m:11,d:1, icon:"✦", title:"World Vegan Day", text:"A day celebrating mindful choices, wellbeing and compassion.", window:0, regions:["international"]},
      {m:11,d:26, icon:"🦃", title:"Happy Thanksgiving", text:"Wishing you a warm Thanksgiving filled with gratitude, wellness and good moments.", window:0, regions:["us"]},
      {m:12,d:25, icon:"🎄", title:"Merry Christmas", text:"Wishing you peace, warmth, wellness and beautiful moments.", window:0, regions:["international","us","uk"]},
      {m:12,d:26, icon:"✦", title:"Happy Boxing Day", text:"Wishing you a peaceful and restorative holiday.", window:0, regions:["uk"]}
    ],
    ru: [
      {m:1,d:1, icon:"✨", title:"С Новым годом!", text:"Желаем вам здоровья, гармонии, благополучия и нового года, полного приятных моментов.", window:1, regions:["international","russia"]},
      {m:1,d:7, icon:"✦", title:"С Рождеством!", text:"Желаем мира, здоровья, тепла и душевного спокойствия.", window:0, regions:["russia"]},
      {m:2,d:23, icon:"✦", title:"С Днём защитника Отечества!", text:"Желаем силы, здоровья, энергии и благополучия.", window:0, regions:["russia"]},
      {m:3,d:8, icon:"🌷", title:"С Международным женским днём!", text:"Желаем красоты, гармонии, здоровья и прекрасного настроения.", window:0, regions:["international","russia"]},
      {m:5,d:1, icon:"✦", title:"С Праздником Весны и Труда!", text:"Желаем вам отдыха, хорошего настроения и новых сил.", window:0, regions:["russia"]},
      {m:5,d:9, icon:"🕊️", title:"С Днём Победы!", text:"Желаем мира, здоровья и благополучия.", window:0, regions:["russia"]},
      {m:6,d:12, icon:"✦", title:"С Днём России!", text:"Желаем мира, здоровья, благополучия и светлых дней.", window:0, regions:["russia"]},
      {m:11,d:4, icon:"✦", title:"С Днём народного единства!", text:"Желаем единства, мира, здоровья и благополучия.", window:0, regions:["russia"]},
      {m:2,d:14, icon:"♥", title:"С Днём святого Валентина!", text:"Желаем любви, тепла, гармонии и заботы о себе.", window:0, regions:["international"]}
    ]
  };

  /*
   * Israeli national dates that are fixed by the Hebrew calendar
   * are handled below through Intl's built-in Hebrew calendar.
   * This avoids maintaining a list of Gregorian dates every year.
   */
  const HEBREW = {
    "Rosh Hashanah": {
      icon:"🍎", start:["Tishri",1], end:["Tishri",2],
      title:"שנה טובה ומתוקה!", text:"Serviam Therapy מאחלת לכם שנה של בריאות, שלווה, wellness והתחדשות."
    },
    "Yom Kippur": {
      icon:"✦", start:["Tishri",10], end:["Tishri",10],
      title:"גמר חתימה טובה", text:"מאחלים לכם יום של שקט, התבוננות והתחדשות."
    },
    "Sukkot": {
      icon:"🌿", start:["Tishri",15], end:["Tishri",21],
      title:"חג סוכות שמח!", text:"מאחלים לכם חג של שמחה, שלווה, בריאות ורגעים טובים."
    },
    "Shemini Atzeret": {
      icon:"✦", start:["Tishri",22], end:["Tishri",22],
      title:"חג שמח!", text:"מאחלים לכם חג של שמחה, שלווה והתחדשות."
    },
    "Purim": {
      icon:"🎭", start:["Adar",14], end:["Adar",14],
      title:"פורים שמח!", text:"מאחלים לכם חג שמח, מלא שמחה, חיוכים ורגעים טובים."
    },
    "Passover": {
      icon:"🫓", start:["Nisan",15], end:["Nisan",21],
      title:"חג פסח שמח!", text:"מאחלים לכם חג של חירות, בריאות, שלווה והתחדשות."
    },
    "Shavuot": {
      icon:"✦", start:["Sivan",6], end:["Sivan",6],
      title:"חג שבועות שמח!", text:"מאחלים לכם חג של שמחה, שלווה ובריאות."
    },
    "Hanukkah": {
      icon:"🕎", start:["Kislev",25], end:["Tevet",2],
      title:"חג חנוכה שמח!", text:"מאחלים לכם חג מלא אור, בריאות, שלווה והתחדשות."
    }
  };

  const ISRAEL_FIXED = [
    {m:2,d:14, icon:"♥", title:"יום המשפחה שמח!", text:"מאחלים לכם זמן איכות, בריאות ורגעים טובים יחד.", regions:["israel"]},
    {m:3,d:8, icon:"🌷", title:"יום האישה הבינלאומי", text:"מאחלים בריאות, כוח, איזון והגשמה.", regions:["international","israel"]},
    {m:1,d:1, icon:"✨", title:"שנה אזרחית טובה!", text:"מאחלים לכם שנה של בריאות, wellness והתחדשות.", regions:["international","israel"]}
  ];

  function localDateParts(date) {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: CONFIG.timeZone, year:"numeric", month:"2-digit", day:"2-digit"
    }).formatToParts(date);
    const out = {};
    parts.forEach(p => { if (p.type !== "literal") out[p.type] = p.value; });
    return {year:+out.year, month:+out.month, day:+out.day};
  }

  function daysFromDate(date) {
    const p = localDateParts(date);
    return new Date(Date.UTC(p.year, p.month - 1, p.day));
  }

  function fixedMatch(item, date) {
    const p = localDateParts(date);
    const today = new Date(Date.UTC(p.year, p.month - 1, p.day));
    const start = new Date(Date.UTC(p.year, item.m - 1, item.d));
    const diff = Math.round((today - start) / 86400000);
    return diff >= -item.window && diff <= item.window;
  }

  function hebrewParts(date) {
    const fmt = new Intl.DateTimeFormat("en-US-u-ca-hebrew", {
      timeZone: CONFIG.timeZone,
      year:"numeric",
      month:"long",
      day:"numeric"
    });
    const parts = fmt.formatToParts(date);
    const out = {};
    parts.forEach(p => { if (p.type !== "literal") out[p.type] = p.value; });
    return {month: normalizeHebrewMonth(out.month || ""), day: parseInt(out.day,10)};
  }

  function normalizeHebrewMonth(month) {
    return month
      .replace(/[’']/g, "")
      .replace(/\s+/g," ")
      .trim()
      .toLowerCase()
      .replace("tishri","Tishri")
      .replace("tishrei","Tishri")
      .replace("heshvan","Cheshvan")
      .replace("cheshvan","Cheshvan")
      .replace("shevat","Shevat")
      .replace("shvat","Shevat")
      .replace("adar i","Adar I")
      .replace("adar ii","Adar II")
      .replace("adar","Adar")
      .replace("nisan","Nisan")
      .replace("iyar","Iyar")
      .replace("sivan","Sivan")
      .replace("tamuz","Tamuz")
      .replace("tammuz","Tamuz")
      .replace("av","Av")
      .replace("elul","Elul")
      .replace("kislev","Kislev")
      .replace("tevet","Tevet");
    return month;
  }

  function hebrewHoliday(date) {
    if (!("DateTimeFormat" in Intl)) return null;

    const h = hebrewParts(date);
    const m = h.month;
    const d = h.day;

    if (m === "Tishri" && d >= 1 && d <= 2) return HEBREW["Rosh Hashanah"];
    if (m === "Tishri" && d === 10) return HEBREW["Yom Kippur"];
    if (m === "Tishri" && d >= 15 && d <= 21) return HEBREW["Sukkot"];
    if (m === "Tishri" && d === 22) return HEBREW["Shemini Atzeret"];
    if ((m === "Adar" || m === "Adar II") && d === 14) return HEBREW["Purim"];
    if ((m === "Nisan") && d >= 15 && d <= 21) return HEBREW["Passover"];
    if (m === "Sivan" && d === 6) return HEBREW["Shavuot"];
    if (m === "Kislev" && d >= 25) return HEBREW["Hanukkah"];
    if (m === "Tevet" && d <= 2) return HEBREW["Hanukkah"];

    return null;
  }

  function candidates(date) {
    const list = [];

    if (lang === "he") {
      const fixed = [...ISRAEL_FIXED, ...FIXED.en.filter(x => x.regions.includes("international"))];
      fixed.forEach(x => { if (fixedMatch(x,date)) list.push(x); });
      const hh = hebrewHoliday(date);
      if (hh) list.unshift(hh);
    } else if (lang === "ru") {
      FIXED.ru.forEach(x => { if (fixedMatch(x,date)) list.push(x); });
    } else {
      FIXED.en.forEach(x => { if (fixedMatch(x,date)) list.push(x); });
    }

    return list;
  }

  function createBanner(data, testMode) {
    const existing = document.getElementById("serviam-celebration-banner");
    if (existing) existing.remove();

    const el = document.createElement("aside");
    el.id = "serviam-celebration-banner";
    el.className = "serviam-celebration-banner";
    el.setAttribute("role","status");
    el.setAttribute("dir", isRTL ? "rtl" : "ltr");

    const bookingText = {
      he: "קביעת טיפול",
      ru: "Записаться на сеанс",
      en: "Book a Treatment"
    }[lang] || "Book a Treatment";

    const closeLabel = {
      he: "סגירת הודעת החג",
      ru: "Закрыть поздравление",
      en: "Close celebration message"
    }[lang] || "Close celebration message";

    el.innerHTML = `
      <div class="serviam-celebration-shine" aria-hidden="true"></div>
      <div class="serviam-celebration-symbol" aria-hidden="true">${data.icon || "✦"}</div>
      <div class="serviam-celebration-copy">
        <span class="serviam-celebration-brand">SERVIAM THERAPY</span>
        <h2>${data.title}</h2>
        <p>${data.text}</p>
      </div>
      <div class="serviam-celebration-actions">
        <a href="${CONFIG.bookingHref}" class="serviam-celebration-button">${bookingText}</a>
        <button type="button" class="serviam-celebration-close" aria-label="${closeLabel}">×</button>
      </div>
    `;

    document.body.appendChild(el);

    requestAnimationFrame(() => el.classList.add("is-visible"));

    el.querySelector(".serviam-celebration-close").addEventListener("click", () => {
      if (!testMode) {
        localStorage.setItem(CONFIG.storageKey, new Date().toISOString().slice(0,10));
      }
      el.classList.remove("is-visible");
      setTimeout(() => el.remove(), 450);
    });
  }

  function alreadyDismissed() {
    try {
      const saved = localStorage.getItem(CONFIG.storageKey);
      return saved === localDateParts(new Date()).year + "-" +
        String(localDateParts(new Date()).month).padStart(2,"0") + "-" +
        String(localDateParts(new Date()).day).padStart(2,"0");
    } catch (_) {
      return false;
    }
  }

  function run() {
    const params = new URLSearchParams(window.location.search);
    const testMode = params.get(CONFIG.testQuery) === "1";

    if (testMode) {
      createBanner({
        icon: "✦",
        title: lang === "he" ? "הודעת חג לדוגמה" : lang === "ru" ? "Тестовое праздничное сообщение" : "Celebration Banner Preview",
        text: lang === "he"
          ? "כך תיראה הודעת חג אוטומטית באתר Serviam Therapy."
          : lang === "ru"
            ? "Так будет выглядеть автоматическое праздничное сообщение на сайте Serviam Therapy."
            : "This is a preview of the automatic celebration banner on Serviam Therapy.",
      }, true);
      return;
    }

    if (alreadyDismissed()) return;

    const found = candidates(new Date());
    if (found.length) createBanner(found[0], false);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
