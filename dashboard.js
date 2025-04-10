document.addEventListener('DOMContentLoaded', function() {
    // Verificar se o usuário está logado
    verificarLogin();
    
    // Toggle do menu de perfil
    const profileToggle = document.getElementById('profileToggle');
    const profileMenu = document.getElementById('profileMenu');
    
    profileToggle.addEventListener('click', function() {
        profileMenu.classList.toggle('active');
    });
    
    // Fechar o menu quando clicar fora dele
    document.addEventListener('click', function(event) {
        if (!profileToggle.contains(event.target) && !profileMenu.contains(event.target)) {
            profileMenu.classList.remove('active');
        }
    });
    
    // Toggle do modo escuro
    const toggleTheme = document.getElementById('toggleTheme');
    const themeIcon = document.getElementById('themeIcon');
    const themeText = document.getElementById('themeText');
    
    toggleTheme.addEventListener('click', function(e) {
        e.preventDefault();
        toggleDarkMode();
    });
    
    // Carregar informações do usuário
    carregarInfoUsuario();
    
    // Botão de logout
    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        logout();
    });
    
    // Função para verificar se o usuário está logado
    function verificarLogin() {
        const usuarioAtual = localStorage.getItem('usuarioAtual');
        
        if (!usuarioAtual) {
            // Redirecionar para a página de login se não estiver logado
            window.location.href = 'login.html';
        }
    }
    
    // Função para carregar informações do usuário
    function carregarInfoUsuario() {
        const usuarioAtual = JSON.parse(localStorage.getItem('usuarioAtual'));
        
        if (usuarioAtual) {
            // Atualizar informações no menu de perfil
            document.getElementById('userName').textContent = usuarioAtual.usuario || 'Usuário';
            document.getElementById('userFullName').textContent = usuarioAtual.nome || 'Nome do Usuário';
            document.getElementById('userEmail').textContent = usuarioAtual.email || 'usuario@email.com';
            
            // Se tiver foto de perfil
            if (usuarioAtual.foto) {
                const fotoPerfil = usuarioAtual.foto;
                document.getElementById('userPhoto').src = fotoPerfil;
                document.querySelector('.dropdown-header img').src = fotoPerfil;
            }
        }
    }
    
    // Função para toggle do modo escuro
    function toggleDarkMode() {
        const html = document.documentElement;
        const isDark = html.getAttribute('data-theme') === 'dark';
        
        if (isDark) {
            html.setAttribute('data-theme', 'light');
            themeIcon.className = 'fas fa-moon';
            themeText.textContent = 'Modo Escuro';
            localStorage.setItem('theme', 'light');
        } else {
            html.setAttribute('data-theme', 'dark');
            themeIcon.className = 'fas fa-sun';
            themeText.textContent = 'Modo Claro';
            localStorage.setItem('theme', 'dark');
        }
    }
    
    // Função para fazer logout
    function logout() {
        // Remover dados do usuário atual
        localStorage.removeItem('usuarioAtual');
        
        // Redirecionar para a página de login
        window.location.href = 'login.html';
    }
    
    // Carregar preferência de tema
    function carregarTema() {
        const tema = localStorage.getItem('theme');
        const html = document.documentElement;
        
        if (tema === 'dark') {
            html.setAttribute('data-theme', 'dark');
            themeIcon.className = 'fas fa-sun';
            themeText.textContent = 'Modo Claro';
        } else {
            html.setAttribute('data-theme', 'light');
            themeIcon.className = 'fas fa-moon';
            themeText.textContent = 'Modo Escuro';
        }
    }
    
    // Carregar tema ao iniciar
    carregarTema();
});