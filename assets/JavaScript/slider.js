// Alternar entre as seções "Para o seu lar" e "Para sua empresa"
function showSection(sectionId) {
  // Esconde todas as seções
  document.querySelectorAll('.slider-section').forEach(section => {
    section.classList.remove('active');
  });

  // Remove o 'active' dos botões
  document.querySelectorAll('.switch-buttons button').forEach(btn => {
    btn.classList.remove('active');
  });

  // Mostra a seção clicada
  document.getElementById(sectionId).classList.add('active');

  // Ativa o botão correspondente
  const index = sectionId === 'home' ? 0 : 1;
  document.querySelectorAll('.switch-buttons button')[index].classList.add('active');
}

// Inicializar todos os sliders Swiper (um para cada carrossel)
document.querySelectorAll('.card-wrapper').forEach(wrapper => {
  new Swiper(wrapper, {
    loop: false,
    spaceBetween: 30,

    pagination: {
      el: wrapper.querySelector('.swiper-pagination'),
      clickable: true,
      dynamicBullets: true
    },

    navigation: {
      nextEl: wrapper.querySelector('.swiper-button-next'),
      prevEl: wrapper.querySelector('.swiper-button-prev'),
    },

    breakpoints: {
      1024: {
        slidesPerView: 4
      },
    }
  });
});
