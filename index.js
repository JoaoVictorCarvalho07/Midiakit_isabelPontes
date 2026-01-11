const nav = document.querySelector("#main-navbar");
let lastScrollY = window.scrollY;

window.addEventListener("scroll", () => {
	if (lastScrollY < window.scrollY) {
		// Descendo: Adiciona a classe para esconder
		nav.classList.add("navbar--hidden");
	} else {
		// Subindo: Remove a classe para mostrar
		nav.classList.remove("navbar--hidden");
	}

	lastScrollY = window.scrollY;
});

const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".main-nav");
const navLinks = document.querySelectorAll(".main-nav a");

// Abre/Fecha ao clicar no ícone
hamburger.addEventListener("click", () => {
	hamburger.classList.toggle("active");
	navMenu.classList.toggle("active");
});

// Fecha o menu ao clicar em um link (para ir até a seção)
navLinks.forEach((link) => {
	link.addEventListener("click", () => {
		hamburger.classList.remove("active");
		navMenu.classList.remove("active");
	});
});

const names = ["1.png", "2.jpg", "3.png", "4.png", "5.jpg"];

const criacarrosel = () => {
	const gallery = document.querySelector(".gallery");
	const track = gallery.querySelector(".carousel-track");
	const dotsWrap = gallery.querySelector(".carousel-dots");
	const btnPrev = gallery.querySelector(".c-btn.prev");
	const btnNext = gallery.querySelector(".c-btn.next");
	const viewport = gallery.querySelector(".carousel-viewport");

	let index = 0;
	let startX = 0;
	let dragging = false;

	// Render slides
	track.innerHTML = names
		.map(
			(name) => `
      <div class="carousel-slide">
        <img src="./assets/fotos-fotografia/${name}" alt="isabelpontes.com.br" draggable="false"/>
      </div>
    `
		)
		.join("");

	function getPerView() {
		return window.matchMedia("(min-width: 640px)").matches ? 3 : 1;
	}
	// Render dots

	function renderDots() {
		const perView = getPerView();
		const pages = Math.max(1, Math.ceil(names.length / perView));

		dotsWrap.innerHTML = Array.from({ length: pages })
			.map(
				(_, i) =>
					`<button class="carousel-dot ${
						i === 0 ? "is-active" : ""
					}" type="button" aria-label="Ir para página ${i + 1}"></button>`
			)
			.join("");

		return Array.from(dotsWrap.querySelectorAll(".carousel-dot"));
	}

	let dots = renderDots();

	function update() {
		const perView = getPerView();
		const pages = Math.max(1, Math.ceil(names.length / perView));

		// clamp para não passar do fim (quando perView muda)
		if (index > pages - 1) index = pages - 1;

		// cada "page" anda 100%
		track.style.transform = `translateX(${-index * 100}%)`;

		dots.forEach((d, i) => d.classList.toggle("is-active", i === index));
	}

	function goTo(i) {
		const perView = getPerView();
		const pages = Math.max(1, Math.ceil(names.length / perView));

		index = (i + pages) % pages;
		update();
	}

	btnPrev.addEventListener("click", () => goTo(index - 1));
	btnNext.addEventListener("click", () => goTo(index + 1));

	dots.forEach((dot, i) => dot.addEventListener("click", () => goTo(i)));

	// Teclado
	window.addEventListener("keydown", (e) => {
		if (e.key === "ArrowLeft") goTo(index - 1);
		if (e.key === "ArrowRight") goTo(index + 1);
	});

	// Swipe (touch + mouse)
	const onDown = (clientX) => {
		dragging = true;
		startX = clientX;
	};

	const onUp = (clientX) => {
		if (!dragging) return;
		dragging = false;
		const diff = clientX - startX;

		// threshold
		if (Math.abs(diff) > 50) {
			if (diff < 0) goTo(index + 1);
			else goTo(index - 1);
		}
	};

	viewport.addEventListener("touchstart", (e) => onDown(e.touches[0].clientX), {
		passive: true,
	});
	viewport.addEventListener("touchend", (e) =>
		onUp(e.changedTouches[0].clientX)
	);

	viewport.addEventListener("mousedown", (e) => onDown(e.clientX));
	window.addEventListener("mouseup", (e) => onUp(e.clientX));
	viewport.addEventListener("dragstart", (e) => e.preventDefault());

	update();

	window.addEventListener("resize", () => {
		dots = renderDots();
		dots.forEach((dot, i) => dot.addEventListener("click", () => goTo(i)));
		update();
	});
};

criacarrosel(names);
// document.getElementsByClassName("gallery-grid")[0].innerHTML = names
// 	.map(
// 		(name) => `
//         <div class="photo-item">
//           <img src="./assets/fotos-fotografia/${name}" alt="isabelpontes.com.br"/>
//         </div>
//       `
// 	)
// 	.join("");

// document.getElementsByClassName("gallery")[0].style.backgroundImage =
// 	'url("./assets/0ce1753182ff5be953436c94907f88c2.jpg")';

function saiuCompletamenteDaTela(el) {
	const r = el.getBoundingClientRect();
	const vh = window.innerHeight || document.documentElement.clientHeight;

	return (
		r.bottom <= 0 || // saiu por cima
		r.top >= vh // saiu por baixo
	);
}

const obs = new IntersectionObserver(
	([entry]) => {
		const saiu =
			entry.isIntersecting === false && entry.intersectionRatio === 0;
		if (saiu) console.log("Saiu completamente!");
	},
	{ threshold: 0 }
);

const pauseSeSaiu = (video) => {
	window.addEventListener("scroll", () => {
		if (saiuCompletamenteDaTela(video)) {
			video.muted = true;
		}
	});
};

const observed = new WeakSet();

const mo = new MutationObserver(() => {
	const videos = videosContainer.querySelectorAll(".video-thumb");
	videos.forEach((video) => {
		if (observed.has(video)) return;
		pauseSeSaiu(video);
		obs.observe(video);
		observed.add(video);
	});
});

// videosInfoTemplate = {
//     Videosrc:"",
//     Imagesrc:"",
//     descricao:""
//     }



// document.getElementsByClassName("video-thumb").forEach(e=>{
//   console.log(e)
//   e.addEventListener("click",(e)=>{
//     console.log(e.target)
//   })
// })


// function muteOthers(currentVideo) {
// 	const all = videosContainer.querySelectorAll(".video-thumb");
// 	all.forEach((v) => {
// 		if (v !== currentVideo) {
// 			v.muted = true;
// 			v.dataset.unmuted = "0"; // marca como "não está com áudio"
// 		}
// 	});
// }


//WhatsApp (Solicitar)
const WHATSAPP_PHONE = "41991977011";

function buildPackageMessage(packageName) {
	const lines = [
		`Oii Isa! Quero solicitar o pacote "${packageName}".`,
		"Pode me enviar valores, prazos e como funciona o envio/briefing? ^-^",
	].filter(Boolean);

	return lines.join("\n");
}

function openWhatsApp(message) {
	const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(
		message
	)}`;
	window.open(url, "_blank"); // abre WhatsApp Web / app
}

// Botões "Solicitar" dos pacotes
document.addEventListener("click", (e) => {
	const btn = e.target.closest(".js-wpp");
	if (!btn) return;

	e.preventDefault();

	const packageName = btn.dataset.wpp || "Pacote UGC";
	const message = buildPackageMessage(packageName);

	openWhatsApp(message);
});

// CTA "Solicitar proposta" (mensagem mais genérica)
document.addEventListener("click", (e) => {
	const cta = e.target.closest(".js-wpp-cta");
	if (!cta) return;

	e.preventDefault();

	const message = [
		"Oii Isa! Quero solicitar uma proposta de UGC 😊",
		"Vou te mandar o básico:",
		"- Marca:",
		"- Produto:",
		"- Objetivo (awareness/conversão):",
		"- Prazo:",
	].join("\n");

	openWhatsApp(message);
});

// //videos supabase

// import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ///////////////////////////////

// async function listFolder(path) {
// 	const { data, error } = await supabase.storage
// 		.from(BUCKET)
// 		.list(path, { limit: 1000 });

// 	if (error) throw error;
// 	return data ?? [];
// }

// async function getCategories(basePath) {
// 	const items = await listFolder(basePath);
// 	// pastas vêm como itens com name e (normalmente) metadata null + id etc.
// 	// A forma mais segura é: tentar listar dentro e ver se retorna algo.
// 	return items.map((x) => x.name).filter(Boolean);
// }

// function stripExt(name) {
// 	return name.replace(/\.[^/.]+$/, "");
// }

// function titleFromSlug(slug) {
// 	return slug.replaceAll("_", " "); // depois você pode melhorar com labels.json
// }

// async function montarVideosInfoPorCategorias() {
// 	const categoriesList = await listFolder(BASE);

// 	// pega só "pastas" (no storage, pasta normalmente não tem metadata/mimetype)
// 	const categories = categoriesList.map((x) => x.name).filter(Boolean);

// 	const all = [];

// 	for (const cat of categories) {
// 		const folder = `${BASE}/${cat}`;
// 		const files = await listFolder(folder);

// 		files
// 			.filter((f) => f?.name && isVideo(f.name))
// 			.forEach((f) => {
// 				const baseName = stripExt(f.name);
// 				const key = baseName.toLowerCase();

// 				const videoPath = `${folder}/${f.name}`;
// 				const videoUrl = publicUrl(videoPath);

// 				const formatDescricao = (name) => stripExt(name).replaceAll("_", " ");

// 				// ✅ sticker local (padroniza nome do sticker = slug do vídeo)
// 				const stickerLocal = `./assets/videos/stickers/${key}.png`; // ou .webp

// 				all.push({
// 					category: cat.toUpperCase(), // ou cat como está
// 					Videosrc: videoUrl,
// 					Imagesrc: stickerLocal, // se não existir localmente, vai quebrar a imagem (dá pra tratar)
// 					descricao: labels[key] || formatDescricao(baseName),
// 				});
// 			});
// 	}

// 	return all;
// }

// function groupByCategory(items) {
// 	return items.reduce((acc, v) => {
// 		(acc[v.category] ||= []).push(v);
// 		return acc;
// 	}, {});
// }

// function renderVideosPorCategoria(videosInfo) {
// 	const groups = videosInfo.reduce((acc, v) => {
// 		(acc[v.category] ||= []).push(v);
// 		return acc;
// 	}, {});

// 	videosContainer.innerHTML = Object.entries(groups)
// 		.map(
// 			([cat, items]) => `
//       <section class="videos-section">
//         <h2 class="videos-title">${cat}</h2>
//         <div class="videos-grid">
//           ${items.map(renderCard).join("")}
//         </div>
//       </section>
//     `
// 		)
// 		.join("");
// }

// function renderCard(v) {
// 	const sticker = v.Imagesrc
// 		? `<img src="${v.Imagesrc}" alt="Sticker do produto" class="product-sticker" onerror="this.remove()" />`
// 		: "";

// 	return `
//     <div class="video-wrapper">
//       <div class="phone-mockup">
//         <video class="video-thumb" muted autoplay loop playsinline preload="metadata" controls controlslist="nodownload">
//           <source src="${v.Videosrc}" type="video/mp4" />
//         </video>
//         <button class="video-overlay" type="button" aria-label="Ativar/desativar áudio"></button>
//       </div>
//       ${sticker}
//       <div class="video-cat">${v.descricao}</div>
//     </div>
//   `;
// }

// //////////////////////////////

// // 1) Suas infos do Supabase

// const SUPABASE_URL = "https://nmfkmufwouerecckdtfw.supabase.co";
// const SUPABASE_ANON_KEY = "sb_publishable_zwJ2fxBdBcfWumfvHEPOEg_okEQs9tP";

// // 2) Bucket e paths
// const BUCKET = "bebels file"; // exatamente assim, com espaço
// const BASE = "videos-ugc";
// // const VIDEOS_FOLDER = `${BASE}/videos`;
// // const STICKERS_FOLDER = `${BASE}/stickers`;

// const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// // Helpers
// const isVideo = (name) => /\.(mp4|webm|mov)$/i.test(name);

// function publicUrl(path) {
// 	const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
// 	return data.publicUrl;
// }

// // // 3) Lista arquivos de uma pasta (1 nível)
// // async function listFolder(folder) {
// // 	const { data, error } = await supabase.storage.from(BUCKET).list(folder, {
// // 		limit: 1000,
// // 		offset: 0,
// // 		sortBy: { column: "name", order: "asc" },
// // 	});

// // 	console.log(data);

// // 	if (error) throw error;
// // 	return data || [];
// // }

// // async function fetchLabels() {
// // 	const response = await fetch("./labels.json");
// // 	const data = await response.json();
// // 	console.log("data", data[""]);
// // 	return data;
// // }

// // async function montarVideosInfo() {
// // 	// A) lista vídeos e sticker

// // 	const [videosList, stickersList] = await Promise.all([
// // 		listFolder(VIDEOS_FOLDER),
// // 		listFolder(STICKERS_FOLDER),
// // 	]);

// // 	// B) cria um mapa: "titulo" -> url do sticker
// // 	const stickerMap = new Map();
// // 	stickersList
// // 		.filter((f) => isImage(f.name))
// // 		.forEach((f) => {
// // 			const key = stripExt(f.name).toLowerCase();
// // 			const path = `${STICKERS_FOLDER}/${f.name}`;
// // 			stickerMap.set(key, publicUrl(path));
// // 		});

// // 	// C) monta array dos vídeos, e tenta achar sticker com mesmo nome

// // 	const labels = await fetchLabels();

// // 	const videosInfo = videosList

// // 		.filter((f) => isVideo(f.name))
// // 		.map((f) => {
// // 			const baseName = stripExt(f.name);
// // 			const key = baseName.toLowerCase();

// // 			console.log("key", key);

// // 			const videoPath = `${VIDEOS_FOLDER}/${f.name}`;
// // 			const videoUrl = publicUrl(videoPath);
// // 			const formatDescricao = (name) => stripExt(name).replaceAll("_", " ");

// // 			const stickerUrl = stickerMap.get(key) || ""; // se não tiver sticker, fica vazio

// // 			return {
// // 				Videosrc: videoUrl,
// // 				Imagesrc: stickerUrl,
// // 				descricao: labels[key] || formatDescricao(baseName), // título = nome do arquivo sem extensão
// // 			};
// // 		});

// // 	return videosInfo;
// // }

// // // ====== AQUI você encaixa seu render ======
// // // const videosContainer = document.getElementById("videosContainer");

// // function renderVideos(videosInfo) {
// // 	videosContainer.innerHTML = "";

// // 	videosInfo.forEach((v) => {
// // 		if (v.Imagesrc) {
// // 			videosContainer.innerHTML += `
// //         <div class="video-wrapper">
// //           <div class="phone-mockup">
// //             <video
// //               id="${v.Videosrc}"
// //               class="video-thumb"
// // 			  controls
// //               muted
// //               autoplay
// //               loop
// //               playsinline
// //               preload="metadata"
// //               controlslist="nodownload "
// //             >
// //               <source src="${v.Videosrc}" type="video/mp4" />
// //             </video>
// //             <button class="video-overlay" type="button" aria-label="Ativar/desativar áudio"></button>
// //           </div>

// //           <img
// //             src="${v.Imagesrc}"
// //             alt="Sticker do produto"
// //             class="product-sticker"
// //           />

// //           <div class="video-cat">${v.descricao}</div>
// //         </div>`;
// // 		} else {
// // 			videosContainer.innerHTML += `
// //         <div class="video-wrapper">
// //           <div class="phone-mockup">
// //             <video
// //               class="video-thumb"
// // 			  controls
// //               muted
// //               autoplay
// //               loop
// //               playsinline
// //               preload="metadata"
// //               controlslist="nodownload"
// //             >
// //               <source src="${v.Videosrc}" type="video/mp4" />
// //             </video>
// //             <button class="video-overlay" type="button" aria-label="Ativar/desativar áudio"></button>
// //           </div>

// //           <div class="video-cat">${v.descricao}</div>
// //         </div>`;
// // 		}
// // 	});
// // }

// // init
// try {
// 	const videosInfo = await montarVideosInfoPorCategorias();
// 	renderVideosPorCategoria(videosInfo);
// 	// montarVideosMock(videosInfo);
// } catch (err) {
// 	videosContainer.innerHTML = "<p>Erro ao carregar vídeos do Supabase.</p>";
// }
