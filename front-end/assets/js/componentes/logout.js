function configurarLogout() {
    const btnSair = document.querySelector('#btn-sair');
  
    btnSair.addEventListener('click', (evento) => {
      evento.preventDefault();
  
      localStorage.removeItem('usuario');
  
      window.location.href = 'login.html';
    });
  }
  
  document.addEventListener('DOMContentLoaded', configurarLogout);