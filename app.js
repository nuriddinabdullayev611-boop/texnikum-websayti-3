// app.js - Asosiy mantiqiy kodlar

document.addEventListener("DOMContentLoaded", () => {
    // 1. Feather ikonkalarini yuklash
    feather.replace();

    // 2. Vanta.js orqa fon animatsiyasini yoqish
    if (document.getElementById("vanta-bg")) {
        VANTA.GLOBE({ 
            el: "#vanta-bg", 
            mouseControls: true, 
            color: 0x3b82f6, 
            backgroundColor: 0x0f172a 
        });
    }

    // 3. Mobil menyuni boshqarish
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener("click", () => {
            mobileMenu.classList.toggle("hidden");
        });
    }

    // 4. Telegram yangiliklarini yuklash
    loadTelegramNews();
});

// Telegram dan ma'lumot olish API
const PROXY = "https://api.allorigins.win/raw?url=";
const TG_CHANNEL = "https://t.me/s/Samarqand_shahar_6_Son_Texnikumi";

function cleanText(s) {
    return (s || "").replace(/\s+/g, " ").trim();
}

function extractBgUrl(styleText) {
    // style: background-image:url('...')
    const m = (styleText || "").match(/url\(['"]?([^'")]+)['"]?\)/i);
    return m ? m[1] : null;
}

async function loadTelegramNews() {
    const container = document.getElementById("newsContainer");
    if (!container) return;

    container.innerHTML = `<p class="col-span-3 text-center text-gray-500">Yuklanmoqda...</p>`;

    try {
        const res = await fetch(PROXY + encodeURIComponent(TG_CHANNEL));
        const htmlText = await res.text();

        const doc = new DOMParser().parseFromString(htmlText, "text/html");
        
        // Yangilik postlari wrapperlarini topish
        const posts = Array.from(doc.querySelectorAll(".tgme_widget_message_wrap")).slice(0, 6);

        if (!posts.length) {
            container.innerHTML = `<p class="col-span-3 text-center text-red-500">❌ Telegramdan postlar topilmadi.</p>`;
            return;
        }

        let out = "";
        posts.forEach((p) => {
            const a = p.querySelector("a.tgme_widget_message_date");
            const link = a ? a.getAttribute("href") : "https://t.me/Samarqand_shahar_6_Son_Texnikumi";
            const time = p.querySelector("time")?.getAttribute("datetime") || "";
            const textEl = p.querySelector(".tgme_widget_message_text");
            const text = cleanText(textEl ? textEl.textContent : "");
            const title = text ? (text.length > 70 ? text.slice(0, 70) + "…" : text) : "Telegram yangiligi";

            const photoWrap = p.querySelector(".tgme_widget_message_photo_wrap");
            const img = photoWrap ? extractBgUrl(photoWrap.getAttribute("style")) : null;
            const imgUrl = img || "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/600px-No-Image-Placeholder.svg.png";

            out += `
<article class="border border-blue-200 bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
<img src="${imgUrl}" alt="Yangilik rasmi" class="w-full h-48 object-cover" loading="lazy">
<div class="p-6">
  <h3 class="text-blue-800 font-bold text-lg mb-3">${title}</h3>
  <p class="text-gray-700 text-sm leading-relaxed mb-4">${text ? (text.length > 160 ? text.slice(0, 160) + "…" : text) : "Post matni Telegramda."}</p>
  <div class="flex items-center justify-between gap-4">
    <span class="text-xs text-gray-500">${time ? new Date(time).toLocaleString("uz-UZ") : ""}</span>
    <a href="${link}" target="_blank" rel="noopener" class="text-blue-600 font-semibold hover:underline">Batafsil →</a>
  </div>
</div>
</article>`;
        });

        container.innerHTML = out;
    } catch (e) {
        container.innerHTML = `<p class="col-span-3 text-center text-red-500">❌ Yangiliklar yuklanmadi. Iltimos, keyinroq qayta urinib ko'ring.</p>`;
    }
}
