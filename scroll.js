document.addEventListener("DOMContentLoaded", function() {
    let mybutton = document.getElementById("myBtn");
  
    window.addEventListener("scroll", scrollFunction);
  
    function scrollFunction() {
      if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        mybutton.style.display = "block";
      } else {
        mybutton.style.display = "none";
      }
    }
  
    mybutton.addEventListener("click", function() {
       if ("scrollBehavior" in document.documentElement.style) {
         window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      } else {
         window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      }
    });
  });