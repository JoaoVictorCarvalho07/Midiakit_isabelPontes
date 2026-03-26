const R2_BASE = "https://pub-2584b081d14449de91b2354653b1d10f.r2.dev";
const BASE_PATH = "videos-ugc"; // pasta raiz no R2
const STICKERS_LOCAL = "./assets/videos/stickers"; // no github

const videosContainer = document.getElementsByClassName("videos-container")[0];

const stripExt = (name) => name.replace(/\.[^/.]+$/, "");
const formatFromSlug = (slug) => slug.replaceAll("_", " ");
const toFolderSlug = (cat) => cat.toLowerCase(); // BELEZA -> beleza

async function fetchJson(path, fallback = {}) {
	try {
		const r = await fetch(path);
		if (!r.ok) return fallback;
		return await r.json();
	} catch {
		return fallback;
	}
}

function renderCard(v) {
	const sticker = v.Imagesrc
		? `<img src="${v.Imagesrc}" alt="Sticker do produto" class="product-sticker" onerror="this.remove()" />`
		: "";

	return `
    <div class="video-wrapper" data-category="${v.category}">
      <div class="phone-mockup">
        <video class="video-thumb"
          muted autoplay loop playsinline preload="metadata"
          controls controlslist="nodownload">
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
	const groups = videosInfo.reduce((acc, v) => {
		(acc[v.category] ||= []).push(v);
		return acc;
	}, {});

	videosContainer.innerHTML = Object.entries(groups)
		.map(
			([cat, items]) =>
				`
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
	`,
		)
		.join("");
}

function muteOthers(currentVideo) {
	videosContainer.querySelectorAll(".video-thumb").forEach((v) => {
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

// Pausar quando sai da tela
const observed = new WeakSet();
const obs = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			const video = entry.target;
			if (!entry.isIntersecting) {
				video.pause();
				video.muted = true;
				video.dataset.unmuted = "0";
			}
		});
	},
	{ threshold: 0.35 },
);

function observarVideos() {
	const videos = videosContainer.querySelectorAll(".video-thumb");
	videos.forEach((v) => {
		if (observed.has(v)) return;
		obs.observe(v);
		observed.add(v);
	});
}

document.addEventListener("DOMContentLoaded", async () => {
	const labels = await fetchJson("./labels.json", {});
	const index = await fetchJson("./videos-index.json", {});
	console.log("Vídeos index:", index);
	// monta lista a partir do index
	const videosInfo = [];

	for (const [category, files] of Object.entries(index)) {
		const folder = toFolderSlug(category);

		for (const file of files) {
			const slug = stripExt(file).toLowerCase();
			const title = labels[slug] || formatFromSlug(slug);

			videosInfo.push({
				category,
				Videosrc: `${R2_BASE}/${BASE_PATH}/${folder}/${file}`,
				Imagesrc: `${STICKERS_LOCAL}/${slug}.png`,
				descricao: title,
			});
		}
	}

	renderVideosPorCategoria(videosInfo);
	setupOverlayClick();
	observarVideos();
});

// =============================
// 5) INIT
// =============================

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
		true, // <- capture!
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
