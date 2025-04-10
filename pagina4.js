document.addEventListener('DOMContentLoaded', function() {
    // Elementos
    const formCadastro = document.getElementById('formulario-cadastro');
    const radioCpf = document.getElementById('login-cpf');
    const radioEmail = document.getElementById('login-email');
    const campoCpf = document.getElementById('campo-cpf');
    const campoEmail = document.getElementById('campo-email');
    const inputCpf = document.getElementById('cpf');
    const inputEmail = document.getElementById('email');
    const inputSenha = document.getElementById('senha');
    const inputConfirmarSenha = document.getElementById('confirmar-senha');
    const toggleSenha = document.getElementById('toggle-senha');
    const erroCpf = document.getElementById('erro-cpf');
    const erroEmail = document.getElementById('erro-email');
    const erroSenha = document.getElementById('erro-senha');
    const erroConfirmarSenha = document.getElementById('erro-confirmar-senha');
    const btnLimpar = document.getElementById('btn-limpar');
    
    // Requisitos da senha
    const reqTamanho = document.getElementById('req-tamanho');
    const reqMaiuscula = document.getElementById('req-maiuscula');
    const reqMinuscula = document.getElementById('req-minuscula');
    const reqNumero = document.getElementById('req-numero');
    const reqEspecial = document.getElementById('req-especial');
    
    // Mostrar ou ocultar os campos CPF e Email com base na seleção
    radioCpf.addEventListener('change', toggleLoginType);
    radioEmail.addEventListener('change', toggleLoginType);
    
    function toggleLoginType() {
        if (radioCpf.checked) {
            campoCpf.style.display = 'block';
            campoEmail.style.display = 'none';
            inputEmail.value = '';
            erroEmail.style.display = 'none';
            inputEmail.classList.remove('campo-invalido');
        } else {
            campoCpf.style.display = 'none';
            campoEmail.style.display = 'block';
            inputCpf.value = '';
            erroCpf.style.display = 'none';
            inputCpf.classList.remove('campo-invalido');
        }
    }
    
    // Máscara para CPF
    inputCpf.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.substring(0, 11);
        
        if (value.length > 9) {
            value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{0,2}).*/, '$1.$2.$3-$4');
        } else if (value.length > 6) {
            value = value.replace(/^(\d{3})(\d{3})(\d{0,3}).*/, '$1.$2.$3');
        } else if (value.length > 3) {
            value = value.replace(/^(\d{3})(\d{0,3}).*/, '$1.$2');
        }
        
        e.target.value = value;
    });
    
    // Validação do de banco de CPF
    //function validarCPF(cpf) {
        //cpf = cpf.replace(/[^\d]/g, '');
        
       // if (cpf.length !== 11) return false;
        
        // Elimina CPFs inválidos conhecidos
        //if (/^(\d)\1+$/.test(cpf)) return false;
        
        // Valida 1o dígito
       // let add = 0;
        //for (let i = 0; i < 9; i++) {
            //add += parseInt(cpf.charAt(i)) * (10 - i);
       // }
        //let rev = 11 - (add % 11);
        //if (rev === 10 || rev === 11) rev = 0;
       // if (rev !== parseInt(cpf.charAt(9))) return false;
        
        // Valida 2o dígito
        //add = 0;
       // for (let i = 0; i < 10; i++) {
           // add += parseInt(cpf.charAt(i)) * (11 - i);
      //  }
       // rev = 11 - (add % 11);
       // if (rev === 10 || rev === 11) rev = 0;
       // if (rev !== parseInt(cpf.charAt(10))) return false;
        
       // return true;
  //  }

  // Validação do CPF (apenas verifica se tem 11 dígitos)
function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, '');
    
    // Apenas verifica se possui 11 dígitos
    return cpf.length === 11;
}
    
    // Validação de email
    function validarEmail(email) {
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regexEmail.test(email);
    }
    
    // Verificação em tempo real dos requisitos da senha
    inputSenha.addEventListener('input', verificarRequisitos);
    
    function verificarRequisitos() {
        const senha = inputSenha.value;
        
        // Verificar requisitos
        const temTamanhoMinimo = senha.length >= 8;
        const temMaiuscula = /[A-Z]/.test(senha);
        const temMinuscula = /[a-z]/.test(senha);
        const temNumero = /[0-9]/.test(senha);
        const temEspecial = /[!@#$%^&*]/.test(senha);
        
        // Atualizar estilos
        atualizarRequisito(reqTamanho, temTamanhoMinimo);
        atualizarRequisito(reqMaiuscula, temMaiuscula);
        atualizarRequisito(reqMinuscula, temMinuscula);
        atualizarRequisito(reqNumero, temNumero);
        atualizarRequisito(reqEspecial, temEspecial);
        
        return temTamanhoMinimo && temMaiuscula && temMinuscula && temNumero && temEspecial;
    }
    
    function atualizarRequisito(elemento, valido) {
        if (valido) {
            elemento.classList.add('requisito-valido');
            elemento.classList.remove('requisito-invalido');
            elemento.querySelector('.icone-requisito').textContent = '✓';
        } else {
            elemento.classList.add('requisito-invalido');
            elemento.classList.remove('requisito-valido');
            elemento.querySelector('.icone-requisito').textContent = '•';
        }
    }
    
    // Alternar visibilidade da senha
    toggleSenha.addEventListener('click', function() {
        if (inputSenha.type === 'password') {
            inputSenha.type = 'text';
            toggleSenha.textContent = '🔒';
        } else {
            inputSenha.type = 'password';
            toggleSenha.textContent = '👁️';
        }
    });
    
    // Botão limpar
    btnLimpar.addEventListener('click', function() {
        formCadastro.reset();
        limparErros();
        // Restaurar o estado inicial do formulário
        radioCpf.checked = true;
        toggleLoginType();
        verificarRequisitos();
    });
    
    function limparErros() {
        // Limpar todos os erros
        const camposErro = document.querySelectorAll('.mensagem-erro');
        camposErro.forEach(campo => {
            campo.style.display = 'none';
        });
        
        // Remover classe de erro dos inputs
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
            input.classList.remove('campo-invalido');
        });
    }
    
    // Submissão do formulário
    formCadastro.addEventListener('submit', function(e) {
        e.preventDefault();
        limparErros();
        
        let temErro = false;
        
        // Validar login (CPF ou email)
        if (radioCpf.checked) {
            if (!inputCpf.value.trim()) {
                mostrarErro(inputCpf, erroCpf, 'O CPF é obrigatório');
                temErro = true;
            } else if (!validarCPF(inputCpf.value)) {
                mostrarErro(inputCpf, erroCpf, 'CPF inválido');
                temErro = true;
            }
        } else {
            if (!inputEmail.value.trim()) {
                mostrarErro(inputEmail, erroEmail, 'O e-mail é obrigatório');
                temErro = true;
            } else if (!validarEmail(inputEmail.value)) {
                mostrarErro(inputEmail, erroEmail, 'E-mail inválido');
                temErro = true;
            }
        }
        
        // Validar senha
        const senhaValida = verificarRequisitos();
        if (!inputSenha.value.trim()) {
            mostrarErro(inputSenha, erroSenha, 'A senha é obrigatória');
            temErro = true;
        } else if (!senhaValida) {
            mostrarErro(inputSenha, erroSenha, 'A senha não atende aos requisitos mínimos');
            temErro = true;
        }
        
        // Validar confirmação de senha
        if (!inputConfirmarSenha.value.trim()) {
            mostrarErro(inputConfirmarSenha, erroConfirmarSenha, 'Confirme sua senha');
            temErro = true;
        } else if (inputSenha.value !== inputConfirmarSenha.value) {
            mostrarErro(inputConfirmarSenha, erroConfirmarSenha, 'As senhas não coincidem');
            temErro = true;
        }
        
        if (!temErro) {
            // Se tudo estiver validado, salvar os dados e redirecionar
            const usuario = {
                tipo: radioCpf.checked ? 'cpf' : 'email',
                login: radioCpf.checked ? inputCpf.value : inputEmail.value,
                senha: inputSenha.value
            };
            
            // Salvar no localStorage para recuperar na página de login
            localStorage.setItem('dadosUsuario', JSON.stringify(usuario));
            
            // Redirecionar para a página de login
            alert('Cadastro realizado com sucesso! Você será redirecionado para a página de login.');
            window.location.href = 'login.html';
        }
    });
    
    function mostrarErro(input, elementoErro, mensagem) {
        input.classList.add('campo-invalido');
        elementoErro.textContent = mensagem;
        elementoErro.style.display = 'block';
    }
});