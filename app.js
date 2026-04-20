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

// Telegram dan ma'lumot olish API (Serverless usuli)
async function loadTelegramNews() {
    const container = document.getElementById("newsContainer");
    if (!container) return;

    container.innerHTML = `<p class="col-span-3 text-center text-gray-500">Yuklanmoqda...</p>`;

    try {
        const res = await fetch('/api/news');

        if (!res.ok) {
            throw new Error(`Server xatosi: ${res.status}`);
        }

        const responseData = await res.json();
        const posts = responseData.data || [];

        if (!posts.length) {
            container.innerHTML = `
            <div class="col-span-3 flex flex-col items-center justify-center py-10">
                <p class="text-gray-500 text-lg">Hozircha bu yerda yangiliklar yo'q.</p>
            </div>`;
            return;
        }

        let out = "";
        posts.forEach((p) => {
            const time = p.date || "";
            const text = p.text || "";
            const title = text ? (text.length > 70 ? text.slice(0, 70) + "..." : text) : "Yangilik";
            const link = p.postLink || "https://t.me/Samarqand_shahar_6_Son_Texnikumi";
            const imgUrl = p.photoUrl || "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/600px-No-Image-Placeholder.svg.png";

            out += `
<article class="border border-blue-200 bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
<div class="h-48 overflow-hidden relative border-b border-blue-100">
  <img src="${imgUrl}" alt="Yangilik rasmi" class="w-full h-full object-cover transition-transform duration-500 hover:scale-110" loading="lazy">
</div>
<div class="p-6 flex flex-col flex-grow">
  <h3 class="text-blue-800 font-bold text-lg mb-3 leading-tight">${title}</h3>
  <p class="text-gray-700 text-sm leading-relaxed mb-4 flex-grow">${text ? (text.length > 150 ? text.slice(0, 150) + "..." : text) : "Maxsus post."}</p>
  <div class="flex items-center justify-between gap-4 mt-auto pt-4 border-t border-gray-100">
    <span class="text-xs text-blue-500 font-medium bg-blue-50 px-2 py-1 rounded-md">${time ? new Date(time).toLocaleDateString("uz-UZ", { year: "numeric", month: "long", day: "numeric" }) : ""}</span>
    <a href="${link}" target="_blank" rel="noopener" class="inline-flex items-center gap-1 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full text-xs font-semibold transition">Batafsil <i data-feather="chevron-right" class="w-3 h-3"></i></a>
  </div>
</div>
</article>`;
        });

        container.innerHTML = out;
        if (typeof feather !== 'undefined') feather.replace();
    } catch (e) {
        console.error("Yangiliklarni yuklashda xato:", e);
        container.innerHTML = `
        <div class="col-span-3 flex flex-col items-center justify-center p-8 bg-white border border-red-100 rounded-3xl shadow-sm">
            <i data-feather="alert-circle" class="text-red-400 w-12 h-12 mb-3"></i>
            <p class="text-center text-red-500 font-medium text-lg">Yangiliklar vaqtincha yuklanmadi.</p>
            <p class="text-gray-500 text-sm mt-2 text-center max-w-md">Iltimos, keyinroq qayta urinib ko'ring yoki to'g'ridan-to'g'ri Telegram kanalimizga kiring.</p>
            <a href="https://t.me/Samarqand_shahar_6_Son_Texnikumi" target="_blank" rel="noopener" class="mt-4 px-6 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-semibold hover:bg-blue-100 transition">Kanalga kirish</a>
        </div>`;
        if (typeof feather !== 'undefined') feather.replace();
    }
}
