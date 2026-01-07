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

const imgHero = document.getElementsByClassName("hero-img-bg")[0];

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

// const updateHeroImage = () => {
// 	if (window.innerWidth <= 768) {
// 		imgHero.src = "./assets/isa.png";
// 		imgHero.style.height = "80vh";
// 	} else {
// 		imgHero.src = "./assets/isa.png";
// 		imgHero.style.height = "85vh";
// 	}
// };

// window.addEventListener("resize", () => {
// 	updateHeroImage();
// });

// window.addEventListener("DOMContentLoaded", () => {
// 	updateHeroImage();
// });

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
		Videosrc: "./assets/videos/whayyyytheydontloveyoulikeiloveu.mp4",
		Imagesrc: "assets/videos/stickers/whey.png",
		descricao: "whey zero lacose probiotica",
	},
	{
		Videosrc: "./assets/videos/redoxon.mp4",
		Imagesrc: "./assets/videos/stickers/redoxonpng.png",
		descricao: "multivitaminico Redoxon",
	},
	{
		Videosrc: "./assets/videos/cafeOnirico.mp4",
		Imagescr: "",
		descricao: "parceria com o café onirico",
	},
	{
		Videosrc: "./assets/videos/ginoCanisten.mp4",
		Imagesrc: "assets/videos/stickers/ginocanisten.png",
		descricao: "sabonete liquido ginocanisten",
	},
];

const videosContainer = document.getElementsByClassName("video-grid")[0];

videosInfo.forEach((v) => {
	videosContainer.innerHTML += `  <div class="video-wrapper">
    <div class="phone-mockup">
      <video
      tabindex="0"
      id=${v.Videosrc}
        muted
        autoplay
        controls
        class="video-thumb"
        
      ><source src=${v.Videosrc} type="video/mp4" /></video>
    </div>
    
    <img 

      src=${v.Imagesrc}
      alt="Produto Câmera"
      class="product-sticker "
    />

    <div class="video-cat">${v.descricao.valueOf()}</div>
  </div>`;
});

// document.getElementsByClassName("video-thumb").forEach(e=>{
//   console.log(e)
//   e.addEventListener("click",(e)=>{
//     console.log(e.target)
//   })
// })

console.log(document.getElementsByClassName("video-thumb"));
const videosList = document.getElementsByClassName("video-thumb");
console.log(videosList);
for (let i = 0; i < videosList.length; i++) {
	console.log("entou");
	videos[i].addEventListener("pointerdown", (e) => {
		e.target.muted = !e.target.muted;
	});
}


// ========= WhatsApp (Solicitar) =========
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
