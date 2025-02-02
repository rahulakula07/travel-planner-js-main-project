let searchbtn=document.querySelector("#search-btn");
let searchbar=document.querySelector(".search-bar-container")
let menu=document.querySelector("#menu-bar")
let navbar =document.querySelector(".navbar")
let videobtn =document.querySelectorAll(".vid-btn")


window.onscroll = ()=>{
    searchbtn.classList.remove("fa-times")
    searchbar.classList.remove("active")
    menu.classList.remove("fa-times")
    navbar.classList.remove("active")

}
searchbtn.addEventListener("click", ()=>{
    searchbtn.classList.toggle("fa-times")
    searchbar.classList.toggle("active")

})
menu.addEventListener("click", ()=>{
    menu.classList.toggle("fa-times")
    navbar.classList.toggle("active")

})
videobtn.foreach(btn =>{
   btn.addEventListener("click",()=>{
    document.querySelector('.controls .active').classList.remove('active');
    btn.classList.add('active')
    let src = btn.getattribute('data-src')
    document.querySelector('#video-slider').src =src;
   })
})
