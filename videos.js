// =============================
// 0) SUPABASE + LABELS
// =============================

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// 1) Infos do Supabase
const SUPABASE_URL = "https://nmfkmufwouerecckdtfw.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_zwJ2fxBdBcfWumfvHEPOEg_okEQs9tP";

// 2) Bucket e base (pastas)
const BUCKET = "bebels file"; // exatamente assim
const BASE = "videos-ugc"; // dentro do bucket

// 3) Cria client (supabase-js já deve estar carregado no HTML)
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// container onde vai renderizar (ajuste para o seu id/classe)
const videosContainer = document.getElementsByClassName("videos-container")[0];
// Helpers
const stripExt = (name) => name.replace(/\.[^/.]+$/, "");
const isVideo = (name) => /\.(mp4|webm|mov|m4v)$/i.test(name);

// URL pública do arquivo no bucket
function publicUrl(path) {
	const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
	return data.publicUrl;
}

// Lista arquivos/pastas de um folder (1 nível)
async function listFolder(folder) {
	const { data, error } = await supabase.storage.from(BUCKET).list(folder, {
		limit: 1000,
		offset: 0,
		sortBy: { column: "name", order: "asc" },
	});

	if (error) throw error;
	return data || [];
}

// Labels (opcional): slug -> "Título bonitinho"
async function fetchLabels() {
	try {
		const response = await fetch("./labels.json");
		if (!response.ok) return {};
		return await response.json();
	} catch {
		return {};
	}
}

function formatDescricaoFromSlug(slug) {
	return slug.replaceAll("_", " ");
}

function formatCategoryTitle(cat) {
	// Ex: "beleza" -> "BELEZA" (mude se quiser Title Case)
	return cat.toUpperCase();
}

// =============================
// 1) MONTA VIDEOS POR CATEGORIAS (pastas)
// Estrutura esperada:
// videos-ugc/
//   beleza/  -> mp4s
//   food/    -> mp4s
//   etc...
//
// Stickers: LOCAL
// ./assets/videos/stickers/<slug>.png
// (se não existir, some automaticamente via onerror)
// =============================
async function montarVideosInfoPorCategorias(labels) {
	const baseItems = await listFolder(BASE);

	// No storage, pastas aparecem como itens com name; vamos tentar tratar como categoria
	// (Se você tiver arquivos soltos na BASE, eles serão ignorados pelo filtro)
	const categories = baseItems.map((x) => x.name).filter(Boolean);

	const all = [];

	for (const cat of categories) {
		const folder = `${BASE}/${cat}`;
		const files = await listFolder(folder);

		files
			.filter((f) => f?.name && isVideo(f.name))
			.forEach((f) => {
				const baseName = stripExt(f.name);
				const slug = baseName.toLowerCase(); // id técnico

				const videoPath = `${folder}/${f.name}`;
				const videoUrl = publicUrl(videoPath);

				// sticker local (se não existir: removemos no onerror do img)
				const stickerLocal = `./assets/videos/stickers/${slug}.png`;

				all.push({
					category: formatCategoryTitle(cat),
					Videosrc: videoUrl,
					Imagesrc: stickerLocal,
					descricao: labels[slug] || formatDescricaoFromSlug(slug),
				});
			});
	}

	return all;
}

// =============================
// 2) RENDER POR CATEGORIA
// =============================
function renderCard(v) {
	// img com onerror remove se não existir
	const sticker = v.Imagesrc
		? `<img src="${v.Imagesrc}" alt="Sticker do produto" class="product-sticker" onerror="this.remove()" />`
		: "";

	return `
    <div class="video-wrapper" data-category="${v.category}">
      <div class="phone-mockup">
        <video
          class="video-thumb"
          muted
          autoplay
          loop
          playsinline
          preload="metadata"
          controls
          controlslist="nodownload"
        >
          <source src="${v.Videosrc}" type="video/mp4" />
        </video>

        <button class="video-overlay" type="button" aria-label="Ativar/desativar áudio"></button>
      </div>

      ${sticker}
      <div class="video-cat">${v.descricao}</div>
    </div>
  `;
}

function renderVideosPorCategoria(videosInfo) {
	// agrupa por categoria
	const groups = videosInfo.reduce((acc, v) => {
		(acc[v.category] ||= []).push(v);
		return acc;
	}, {});

	videosContainer.innerHTML = Object.entries(groups)
		.map(
			([cat, items]) => `
      <section class="videos-section">
      <div>
   <p class="trasso"></p>
</div>
        <div class="center">        
            <h2 class="videos-title">${cat}</h2>
        </div>
        
        <div class="video-grid">
        
          ${items.map(renderCard).join("")}
        </div>
      </section>
    `
		)
		.join("");
}

// =============================
// 3) OVERLAY: 1º clique desmuta, esconde sticker e depois remove overlay
//    + regra: se 1 vídeo desmutar, os outros mutam
// =============================
function muteOthers(currentVideo) {
	const all = videosContainer.querySelectorAll(".video-thumb");
	all.forEach((v) => {
		if (v !== currentVideo) {
			v.muted = true;
			v.dataset.unmuted = "0";
		}
	});
}

function setupOverlayClick() {
	videosContainer.addEventListener("click", async (e) => {
		const overlay = e.target.closest(".video-overlay");
		if (!overlay) return;

		const card = overlay.closest(".video-wrapper");
		const video = card?.querySelector(".video-thumb");
		const sticker = card?.querySelector(".product-sticker");
		if (!video) return;

		// 1º clique: libera áudio e "deixa normal" (removendo overlay)
		if (video.dataset.unmuted !== "1") {
			muteOthers(video);

			video.muted = false;
			video.volume = 1;
			video.dataset.unmuted = "1";

			if (sticker) sticker.style.display = "none";

			overlay.remove(); // depois disso o vídeo fica normal
		}

		try {
			await video.play();
		} catch {}
	});
}

// =============================
// 4) PAUSAR QUANDO SAI DA TELA (IntersectionObserver)
// (root: null = viewport da página; se seu scroll for num container, me avise)
// =============================
const observed = new WeakSet();

const obs = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			const video = entry.target;
			if (!video) return;

			if (!entry.isIntersecting) {
				video.pause();
				video.muted = true;
				video.dataset.unmuted = "0";
			} else {
				// opcional: retomar autoplay quando entrar
				// video.play().catch(()=>{});
			}
		});
	},
	{ threshold: 0.35 }
);

function observarVideosNovos() {
	const videos = videosContainer.querySelectorAll(".video-thumb");
	videos.forEach((video) => {
		if (observed.has(video)) return;
		obs.observe(video);
		observed.add(video);
	});
}

// =============================
// 5) INIT
// =============================
document.addEventListener("DOMContentLoaded", async () => {
	try {
		const labels = await fetchLabels();

		const videosInfo = await montarVideosInfoPorCategorias(labels);

		renderVideosPorCategoria(videosInfo);

		setupOverlayClick();
		observarVideosNovos();
	} catch (err) {
		console.error(err);
		if (videosContainer) {
			videosContainer.innerHTML = `<p style="padding:16px">Não foi possível carregar os vídeos. Verifique permissões/pastas do Supabase.</p>`;
		}
	}
});

document.addEventListener("DOMContentLoaded", () => {
	obs.observe(videosContainer, { childList: true, subtree: true });

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

			if (sticker && window.innerWidth > 640) {
				sticker.style.display = "none";
			}
		} else {
			// próxim os cliques: toggle mute
			video.muted = !video.muted;
			if (sticker && window.innerWidth > 640) {
				console.log("tem sticker", sticker);
				if (sticker.style.display == "block") {
					sticker.style.display = "none";
				} else {
					sticker.style.display = "block";
				}
			}
			video.onpaused = () => {
				if (sticker && window.innerWidth > 640) {
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
					if (sticker) sticker.style.display = "block";
				} catch (err) {
					console.warn("play() falhou:", err);
				}
			};
			video.onplay = () => {
				try {
					video.muted = false;
					if (sticker) sticker.style.display = "none";
				} catch (err) {
					console.warn("play() falhou:", err);
				}
			};
		} catch (err) {
			console.warn("play() falhou:", err);
		}
	});
});

function mockvideos() {
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
}
