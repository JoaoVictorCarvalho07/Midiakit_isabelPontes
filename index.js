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

const videosInfo = [
	{
		Videosrc: "./videosS/whayyyytheydontloveyoulikeiloveu.mp4",
		Imagesrc: "assets/videos/stickers/whey.png",
		descricao: "Probiotica",
	},
	{
		Videosrc: "./videosS/redoxon.mp4",
		Imagesrc: "./assets/videos/stickers/redoxonpng.png",
		descricao: "Redoxon",
	},
	{
		Videosrc: "./videosS/cafeOnirico.mp4",
		Imagesrc: "",
		descricao: "Café onirico",
	},
	{
		Videosrc: "./videoS/ginoCanisten.mp4",
		Imagesrc: "./assets/videos/stickers/ginocanisten.png",
		descricao: "Ginocanisten",
	},
	{
		Videosrc: "./videoS/Lorealprotetorsolar.mp4",
		Imagesrc: "assets/videos/stickers/solar-expertise-efeito-20-1.webp",
		descricao: "Loreal",
	},
];

const videosContainer = document.getElementsByClassName("video-grid")[0];
const montarVideosMock = (videosInfo) => {
	videosInfo.forEach((v) => {
		if (v.Imagesrc) {
			videosContainer.innerHTML += `
				<div class="video-wrapper" >
	    			<div class="phone-mockup">
						<video
						controls
							class="video-thumb"
							muted
							autoplay
							loop
							playsinline
							preload="metadata"
							              controlslist=" play nodownload noremoteplayback"

						>
							<source src="${v.Videosrc}" type="video/mp4" />
						</video>
	 					 <button class="video-overlay" type="button" aria-label="Ativar/desativar áudio"></button>
					</div>
					<img
					src=${v.Imagesrc}
					alt="Produto Câmera"
					class="product-sticker "
					/>
	    			<div class="video-cat">${v.descricao.valueOf()}</div>
	  			</div>`;
		} else {
			videosContainer.innerHTML += `
				<div class="video-wrapper" >
	    			<div class="phone-mockup">
						<video
							controls
							class="video-thumb"
							muted
							autoplay
							loop
							playsinline
							preload="metadata"
							controlslist="nodownload"
						>
							<source src="${v.Videosrc}" type="video/mp4" />
						</video>
	 					 <button class="video-overlay" type="button" aria-label="Ativar/desativar áudio"></button>
					</div>
	    			<div class="video-cat">${v.descricao.valueOf()}</div>
	  			</div>`;
		}
	});

	mo.observe(videosContainer, { childList: true, subtree: true });
};

// document.getElementsByClassName("video-thumb").forEach(e=>{
//   console.log(e)
//   e.addEventListener("click",(e)=>{
//     console.log(e.target)
//   })
// })

console.log(document.getElementsByClassName("video-thumb"));

function muteOthers(currentVideo) {
	const all = videosContainer.querySelectorAll(".video-thumb");
	all.forEach((v) => {
		if (v !== currentVideo) {
			v.muted = true;
			v.dataset.unmuted = "0"; // marca como "não está com áudio"
		}
	});
}

document.addEventListener("DOMContentLoaded", () => {
	mo.observe(videosContainer, { childList: true, subtree: true });

	videosContainer.addEventListener(
		"play",
		(e) => {
			const video = e.target;
			if (!video.classList.contains("video-thumb")) return;

			// Se esse vídeo estiver com áudio liberado, muta os outros
			if (video.dataset.unmuted === "1" && !video.muted) {
				muteOthers(video);
			}
		},
		true // <- capture!
	);
	videosContainer.addEventListener("click", async (e) => {
		const overlay = e.target.closest(".video-overlay");
		if (!overlay) return;

		const wrapper = overlay.closest(".phone-mockup");
		const video = wrapper?.querySelector(".video-thumb");
		if (!video) return;

		// pega o card inteiro e o sticker
		const card = overlay.closest(".video-wrapper");
		const sticker = card?.querySelector(".product-sticker");

		// 1º clique: só desmuta
		if (video.dataset.unmuted !== "1") {
			muteOthers(video);
			video.muted = false;
			video.volume = 1;
			video.dataset.unmuted = "1";

			if (sticker) {
				sticker.style.display = "none";
			}
		} else {
			// próxim os cliques: toggle mute
			video.muted = !video.muted;
			if (sticker) {
				console.log("tem sticker", sticker);
				if (sticker.style.display == "block") {
					sticker.style.display = "none";
				} else {
					sticker.style.display = "block";
				}
			}
			video.onpaused = () => {
				if (sticker) {
					console.log("tem sticker", sticker);
					sticker.style.display = "block";
				}
			};
		}

		// garante que continua tocando (se algum browser pausar)
		try {
			await video.play();
			video.onpaused = async () => {
				try {
					video.muted = true;
					sticker.style.display = "block";
				} catch (err) {
					console.warn("play() falhou:", err);
				}
			};
			video.onplay = () => {
				try {
					video.muted = false;
					sticker.style.display = "none";
				} catch (err) {
					console.warn("play() falhou:", err);
				}
			};
		} catch (err) {
			console.warn("play() falhou:", err);
		}
	});
});
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

//videos supabase

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// 1) Suas infos do Supabase
const SUPABASE_URL = "https://nmfkmufwouerecckdtfw.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_zwJ2fxBdBcfWumfvHEPOEg_okEQs9tP";

// 2) Bucket e paths
const BUCKET = "bebels file"; // exatamente assim, com espaço
const BASE = "videos-ugc";
const VIDEOS_FOLDER = `${BASE}/videos`;
const STICKERS_FOLDER = `${BASE}/stickers`;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helpers
const stripExt = (name) => name.replace(/\.[^/.]+$/, ""); // remove extensão
const isVideo = (name) => /\.(mp4|webm|mov)$/i.test(name);
const isImage = (name) => /\.(png|webp|jpg|jpeg|gif)$/i.test(name);

function publicUrl(path) {
	const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
	console.log("data");
	return data.publicUrl;
}

// 3) Lista arquivos de uma pasta (1 nível)
async function listFolder(folder) {
	const { data, error } = await supabase.storage.from(BUCKET).list(folder, {
		limit: 1000,
		offset: 0,
		sortBy: { column: "name", order: "asc" },
	});

	console.log(data);

	if (error) throw error;
	return data || [];
}

async function fetchLabels() {
	const response = await fetch("./labels.json");
	const data = await response.json();
	console.log("data", data[""]);
	return data;
}

async function montarVideosInfo() {
	// A) lista vídeos e sticker

	const [videosList, stickersList] = await Promise.all([
		listFolder(VIDEOS_FOLDER),
		listFolder(STICKERS_FOLDER),
	]);

	// B) cria um mapa: "titulo" -> url do sticker
	const stickerMap = new Map();
	stickersList
		.filter((f) => isImage(f.name))
		.forEach((f) => {
			const key = stripExt(f.name).toLowerCase();
			const path = `${STICKERS_FOLDER}/${f.name}`;
			stickerMap.set(key, publicUrl(path));
		});

	// C) monta array dos vídeos, e tenta achar sticker com mesmo nome

	const labels = await fetchLabels();

	const videosInfo = videosList

		.filter((f) => isVideo(f.name))
		.map((f) => {
			const baseName = stripExt(f.name);
			const key = baseName.toLowerCase();

			console.log("key", key);

			const videoPath = `${VIDEOS_FOLDER}/${f.name}`;
			const videoUrl = publicUrl(videoPath);
			const formatDescricao = (name) => stripExt(name).replaceAll("_", " ");

			const stickerUrl = stickerMap.get(key) || ""; // se não tiver sticker, fica vazio

			return {
				Videosrc: videoUrl,
				Imagesrc: stickerUrl,
				descricao: labels[key] || formatDescricao(baseName), // título = nome do arquivo sem extensão
			};
		});

	return videosInfo;
}

// ====== AQUI você encaixa seu render ======
// const videosContainer = document.getElementById("videosContainer");

function renderVideos(videosInfo) {
	videosContainer.innerHTML = "";

	videosInfo.forEach((v) => {
		if (v.Imagesrc) {
			videosContainer.innerHTML += `   
        <div class="video-wrapper">
          <div class="phone-mockup">
            <video
              id="${v.Videosrc}"
              class="video-thumb"
			  controls
              muted
              autoplay
              loop
              playsinline
              preload="metadata"
              controlslist="nodownload "
            >
              <source src="${v.Videosrc}" type="video/mp4" />
            </video>
            <button class="video-overlay" type="button" aria-label="Ativar/desativar áudio"></button>
          </div>

          <img 
            src="${v.Imagesrc}"
            alt="Sticker do produto"
            class="product-sticker"
          />

          <div class="video-cat">${v.descricao}</div>
        </div>`;
		} else {
			videosContainer.innerHTML += `   
        <div class="video-wrapper">
          <div class="phone-mockup">
            <video
              class="video-thumb"
			  controls
              muted
              autoplay
              loop
              playsinline
              preload="metadata"
              controlslist="nodownload"
            >
              <source src="${v.Videosrc}" type="video/mp4" />
            </video>
            <button class="video-overlay" type="button" aria-label="Ativar/desativar áudio"></button>
          </div>

          <div class="video-cat">${v.descricao}</div>
        </div>`;
		}
	});
}

// init
try {
	const videosInfo = await montarVideosInfo();
	renderVideos(videosInfo);
	// montarVideosMock(videosInfo);
} catch (err) {
	console.log("asçdlas");
	videosContainer.innerHTML = "<p>Erro ao carregar vídeos do Supabase.</p>";
}
