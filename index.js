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


const names = [
	"athena.jpg",
	"cadaverbride.jpg",
	"goth.png",
	"horsewithnoname.png",
	"kawai.png",
];

document.getElementsByClassName("gallery-grid")[0].innerHTML = names
	.map(
		(name) => `
        <div class="photo-item">
          <img src="./assets/fotos-fotografia/${name}" alt="isabelpontes.com.br"/>
        </div>
      `
	)
	.join("");
document.getElementsByClassName("gallery")[0].style.backgroundImage =
	'url("./assets/0ce1753182ff5be953436c94907f88c2.jpg")';

let videos = document.getElementsByClassName("video-thumb");

function saiuCompletamenteDaTela(el) {
	const r = el.getBoundingClientRect();
	const vh = window.innerHeight || document.documentElement.clientHeight;
	const vw = window.innerWidth || document.documentElement.clientWidth;

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
			video.pause();
		} else {
			video.play();
		}
	});
};

for (let i = 0; i < videos.length; i++) {
	let video = videos[i];
	pauseSeSaiu(video);
	console.log(obs.observe(video));
}

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

// videosInfo.forEach((v) => {
// 	if (v.Imagesrc) {
// 		videosContainer.innerHTML += `
// 			<div class="video-wrapper" >
//     			<div class="phone-mockup">
// 					<video
// 						tabindex="0"
// 						id="${v.Videosrc}"
// 						class="video-thumb"
// 						muted
// 						autoplay
// 						loop
// 						playsinline
// 						preload="metadata"
// 						controlslist="nodownload"
// 					>
// 						<source src="${v.Videosrc}" type="video/mp4" />
// 					</video>

//  					 <button class="video-overlay" type="button" aria-label="Ativar/desativar áudio"></button>
// 				</div>

// 				<img
// 				src=${v.Imagesrc}
// 				alt="Produto Câmera"
// 				class="product-sticker "
// 				/>

//     			<div class="video-cat">${v.descricao.valueOf()}</div>
//   			</div>`;
// 	} else {
// 		videosContainer.innerHTML += `
// 			<div class="video-wrapper" >
//     			<div class="phone-mockup">
// 					<video
// 						tabindex="0"
// 						id="${v.Videosrc}"
// 						class="video-thumb"
// 						muted
// 						autoplay
// 						loop
// 						playsinline
// 						preload="metadata"
// 						controlslist="nodownload"
// 					>
// 						<source src="${v.Videosrc}" type="video/mp4" />
// 					</video>

//  					 <button class="video-overlay" type="button" aria-label="Ativar/desativar áudio"></button>
// 				</div>

//     			<div class="video-cat">${v.descricao.valueOf()}</div>
//   			</div>`;
// 	}
// });

// document.getElementsByClassName("video-thumb").forEach(e=>{
//   console.log(e)
//   e.addEventListener("click",(e)=>{
//     console.log(e.target)
//   })
// })

console.log(document.getElementsByClassName("video-thumb"));
let videosList;

document.addEventListener("DOMContentLoaded", () => {
	videosList = document.getElementsByClassName("video-thumb");
	videosContainer.addEventListener("click", async (e) => {
		const overlay = e.target.closest(".video-overlay");
		if (!overlay) return;

		const wrapper = overlay.closest(".phone-mockup");
		const video = wrapper?.querySelector(".video-thumb");
		if (!video) return;

		// 1º clique: só desmuta
		if (video.dataset.unmuted !== "1") {
			video.muted = false;
			video.volume = 1;
			video.dataset.unmuted = "1";
		} else {
			// próximos cliques: toggle mute
			video.muted = !video.muted;
		}

		// garante que continua tocando (se algum browser pausar)
		try {
			await video.play();
		} catch (err) {
			console.warn("play() falhou:", err);
		}

		document.get;
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

const { data, error } = await supabase.storage.from(BUCKET).list("videos-ugc");
console.log("videos-ugc error:", error);
console.log("videos-ugc data:", data);

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
	const videosInfo = videosList
		.filter((f) => isVideo(f.name))
		.map((f) => {
			const baseName = stripExt(f.name);
			const key = baseName.toLowerCase();

			const videoPath = `${VIDEOS_FOLDER}/${f.name}`;
			const videoUrl = publicUrl(videoPath);
			const formatDescricao = (name) => stripExt(name).replaceAll("_", " ");

			const stickerUrl = stickerMap.get(key) || ""; // se não tiver sticker, fica vazio

			console.log(videoPath);
			return {
				Videosrc: videoUrl,
				Imagesrc: stickerUrl,
				descricao: formatDescricao(baseName), // título = nome do arquivo sem extensão
			};
		});

	console.log(videosInfo);
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
              tabindex="0"
              id="${v.Videosrc}"
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
              tabindex="0"
              id="${v.Videosrc}"
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

          <div class="video-cat">${v.descricao}</div>
        </div>`;
		}
	});
}

// init
try {
	const videosInfo = await montarVideosInfo();
	renderVideos(videosInfo);
} catch (err) {
	console.log("asçdlas");
	videosContainer.innerHTML = "<p>Erro ao carregar vídeos do Supabase.</p>";
}
