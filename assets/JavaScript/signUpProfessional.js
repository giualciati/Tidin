const tipoConta = document.getElementById('tipo-conta');
const formPF = document.getElementById('form-signUp-pf');
const formPJ = document.getElementById('form-signUp-pj');

tipoConta.addEventListener('change', () => {
  if (tipoConta.checked) {
    formPF.style.display = 'none';
    formPJ.style.display = 'block';
  } else {
    formPF.style.display = 'block';
    formPJ.style.display = 'none';
  }
});