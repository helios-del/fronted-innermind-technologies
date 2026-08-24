
document.querySelectorAll("[data-year]").forEach(el => el.textContent = new Date().getFullYear());

const menu = document.querySelector(".menu");
const links = document.querySelector(".links");
if(menu){
  menu.addEventListener("click",()=> {
    links.style.display = links.style.display === "flex" ? "none" : "flex";
    links.style.position = "absolute";
    links.style.top = "76px";
    links.style.left = "0";
    links.style.right = "0";
    links.style.padding = "18px 20px";
    links.style.background = "rgba(7,17,31,.97)";
    links.style.flexDirection = "column";
    links.style.alignItems = "flex-start";
  });
}
