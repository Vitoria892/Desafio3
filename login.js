document.addEventListener('DOMContentLoaded', function () {
    const formLogin = document.getElementById('formLogin');

    carregarDadosTemporarios();
    formLogin.addEventListener('submit', validarLogin);
    formLogin.addEventListener('input', salvarDadosTemporariamente);

    function validarLogin(evento) {
        evento.preventDefault();

        limparMensagensErro();

        const usuarioInput = document.getElementById('usuario').value.trim();
        const senha = document.getElementById('senha').value.trim();

        let formValido = true;

        if (!usuarioInput) {
            mostrarErro('usuario', 'Por favor, informe seu CPF ou e-mail');
            formValido = false;
        }

        if (!senha) {
            mostrarErro('senha', 'Por favor, informe sua senha');
            formValido = false;
        }

        if (!formValido) return false;

        // Recuperar os dados salvos pelo cadastro
        const dadosUsuario = JSON.parse(localStorage.getItem('dadosUsuario'));
        
        // Verificar se os dados existem e se correspondem
        if (dadosUsuario && 
            dadosUsuario.login === usuarioInput && 
            dadosUsuario.senha === senha) {
            
            // Criar objeto de usuário atual no formato esperado pelo dashboard
            const usuarioAtual = {
                usuario: dadosUsuario.login,
                nome: dadosUsuario.login,  // Pode usar o login como nome se não tiver nome específico
                email: dadosUsuario.tipo === 'email' ? dadosUsuario.login : 'usuario@exemplo.com'
            };
            
            // Salvar dados no localStorage com a chave esperada pelo dashboard
            localStorage.setItem('usuarioAtual', JSON.stringify(usuarioAtual));
            localStorage.setItem('usuarioLogado', 'true');
            
            // Remover dados temporários
            localStorage.removeItem('loginTemp');
            
            // Redirecionar para o dashboard
            window.location.replace('dashboard.html');
        } else {
            mostrarErro('usuario', 'CPF, e-mail ou senha incorretos');
        }
    }

    function mostrarErro(campoId, mensagem) {
        const campo = document.getElementById(campoId);
        campo.classList.add('campo-invalido');

        const mensagemErro = document.createElement('div');
        mensagemErro.classList.add('mensagem-erro');
        mensagemErro.textContent = mensagem;

        campo.parentNode.appendChild(mensagemErro);
    }

    function limparMensagensErro() {
        document.querySelectorAll('.mensagem-erro').forEach(e => e.remove());
        document.querySelectorAll('.campo-invalido').forEach(e => e.classList.remove('campo-invalido'));
    }

    function salvarDadosTemporariamente() {
        const formData = {
            usuario: document.getElementById('usuario').value
        };
        localStorage.setItem('loginTemp', JSON.stringify(formData));
    }

    function carregarDadosTemporarios() {
        const dadosSalvos = localStorage.getItem('loginTemp');
        if (dadosSalvos) {
            const formData = JSON.parse(dadosSalvos);
            if (formData.usuario) {
                document.getElementById('usuario').value = formData.usuario;
            }
        }
    }
});
  