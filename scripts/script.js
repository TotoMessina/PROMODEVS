$(document).ready(function(){
    $('.slick-slider').slick({
      slidesToShow: 4, // Cantidad de productos visibles a la vez
      slidesToScroll: 2, // Cantidad de productos que se desplazan en cada transición
      autoplay: true, // Reproducción automática
      autoplaySpeed: 50000000, // Velocidad de reproducción automática en milisegundos
      arrows: false, // Oculta las flechas de navegación
      responsive: [
        {
          breakpoint: 768, // Cambios en la configuración para dispositivos de menos de 768px de ancho
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1
          }
        },
        {
          breakpoint: 480, // Cambios en la configuración para dispositivos de menos de 480px de ancho
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
    });
  });