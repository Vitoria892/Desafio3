// Aguardar o carregamento do DOM
document.addEventListener('DOMContentLoaded', function() {
    // Referências aos elementos do formulário
    const form = document.getElementById('formulario-inscricao');
    const campos = {
        nome: document.getElementById('nome'),
        data: document.getElementById('data'),
        cpf: document.getElementById('cpf'),
        sexo: document.getElementById('sexo'),
        email: document.getElementById('email'),
        telefone: document.getElementById('telefone'),
        documento: document.getElementById('documento')
    };
    
    // Botão de próxima página
    const btnProxima = document.querySelector('.proxima');
    
    // Adicionar botão Salvar
    const botoesDiv = document.querySelector('.botoes');
    const btnSalvar = document.createElement('button');
    btnSalvar.type = 'button';
    btnSalvar.className = 'salvar';
    btnSalvar.textContent = 'Salvar';
    btnSalvar.style.marginRight = '10px';
    btnSalvar.style.padding = '10px 20px';
    btnSalvar.style.backgroundColor = '#4CAF50';
    btnSalvar.style.color = 'white';
    btnSalvar.style.border = 'none';
    btnSalvar.style.borderRadius = '5px';
    btnSalvar.style.fontWeight = 'bold';
    btnSalvar.style.cursor = 'pointer';
    botoesDiv.insertBefore(btnSalvar, btnProxima);
    
    // Função para criar e mostrar mensagem de erro
    function mostrarErro(campo, mensagem) {
        // Remover mensagem anterior se existir
        removerErro(campo);
        
        // Adicionar classe de erro ao campo
        campo.classList.add('campo-invalido');
        
        // Criar elemento de mensagem de erro
        const erro = document.createElement('span');
        erro.className = 'mensagem-erro';
        erro.textContent = mensagem;
        
        // Inserir após o campo
        campo.parentNode.appendChild(erro);
    }
    
    // Função para remover mensagem de erro
    function removerErro(campo) {
        campo.classList.remove('campo-invalido');
        const mensagemErro = campo.parentNode.querySelector('.mensagem-erro');
        if (mensagemErro) {
            mensagemErro.remove();
        }
    }
    
    // Função para mostrar mensagem de sucesso
    function mostrarMensagemSucesso(mensagem) {
        // Remover mensagem anterior se existir
        const mensagemAnterior = document.querySelector('.mensagem-sucesso');
        if (mensagemAnterior) {
            mensagemAnterior.remove();
        }
        
        // Criar elemento de mensagem de sucesso
        const divSucesso = document.createElement('div');
        divSucesso.className = 'mensagem-sucesso';
        
        // Adicionar ícone
        const icone = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        icone.setAttribute('class', 'icone-sucesso');
        icone.setAttribute('viewBox', '0 0 24 24');
        icone.setAttribute('width', '24');
        icone.setAttribute('height', '24');
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z');
        path.setAttribute('fill', 'white');
        
        icone.appendChild(path);
        divSucesso.appendChild(icone);
        
        // Adicionar texto
        const texto = document.createElement('span');
        texto.textContent = mensagem;
        divSucesso.appendChild(texto);
        
        // Inserir antes do formulário
        form.parentNode.insertBefore(divSucesso, form);
        
        // Remover após 5 segundos
        setTimeout(() => {
            divSucesso.remove();
        }, 5000);
    }
    
    // Validadores individuais
    const validadores = {
        // Validação de nome (não vazio e pelo menos nome e sobrenome)
        nome: function(valor) {
            if (!valor.trim()) {
                return 'O nome completo é obrigatório';
            }
            if (valor.trim().split(' ').length < 2) {
                return 'Digite seu nome completo (nome e sobrenome)';
            }
            return '';
        },
        
        // Validação de data de nascimento (formato DD/MM/AAAA)
        data: function(valor) {
            if (!valor.trim()) {
                return 'A data de nascimento é obrigatória';
            }
            
            // Verificar formato DD/MM/AAAA
            const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
            if (!regex.test(valor)) {
                return 'Digite a data no formato DD/MM/AAAA';
            }
            
            const partes = valor.split('/');
            const dia = parseInt(partes[0]);
            const mes = parseInt(partes[1]);
            const ano = parseInt(partes[2]);
            
            // Verificar valores válidos
            if (dia < 1 || dia > 31) {
                return 'Dia inválido';
            }
            if (mes < 1 || mes > 12) {
                return 'Mês inválido';
            }
            
            const dataAtual = new Date();
            const anoAtual = dataAtual.getFullYear();
            
            if (ano < 1900 || ano > anoAtual) {
                return 'Ano inválido';
            }
            
            // Verificar dias de cada mês
            const diasPorMes = [31, (ano % 4 === 0 && (ano % 100 !== 0 || ano % 400 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            if (dia > diasPorMes[mes - 1]) {
                return 'Data inválida para o mês informado';
            }
            
            return '';
        },
        
        // Validação de CPF
        cpf: function(valor) {
            if (!valor.trim()) {
                return 'O CPF é obrigatório';
            }
            
            // Remover caracteres não numéricos
            const cpfLimpo = valor.replace(/\D/g, '');
            
            // Verificar se tem 11 dígitos
            if (cpfLimpo.length !== 11) {
                return 'CPF deve ter 11 dígitos';
            }
            
           
            // Validação do algoritmo do CPF
            let soma = 0;
            let resto;
            
            for (let i = 1; i <= 9; i++) {
                soma += parseInt(cpfLimpo.substring(i - 1, i)) * (11 - i);
            }
            
            resto = (soma * 10) % 11;
            if (resto === 10 || resto === 11) {
                resto = 0;
            }
            
            if (resto !== parseInt(cpfLimpo.substring(9, 10))) {
                return 'CPF inválido';
            }
            
            soma = 0;
            for (let i = 1; i <= 10; i++) {
                soma += parseInt(cpfLimpo.substring(i - 1, i)) * (12 - i);
            }
            
            resto = (soma * 10) % 11;
            if (resto === 10 || resto === 11) {
                resto = 0;
            }
            
            if (resto !== parseInt(cpfLimpo.substring(10, 11))) {
                return 'CPF inválido';
            }
            
            return '';
        },
        
        // Validação de sexo (deve ser selecionado)
        sexo: function(valor) {
            if (!valor) {
                return 'Selecione uma opção';
            }
            return '';
        },
        
        // Validação de e-mail
        email: function(valor) {
            if (!valor.trim()) {
                return 'O e-mail é obrigatório';
            }
            
            const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!regex.test(valor)) {
                return 'Digite um e-mail válido';
            }
            
            return '';
        },
        
        // Validação de telefone
        telefone: function(valor) {
            if (!valor.trim()) {
                return 'O telefone é obrigatório';
            }
            
            // Remover caracteres não numéricos
            const telLimpo = valor.replace(/\D/g, '');
            
            // Verificar se tem entre 10 e 11 dígitos (com ou sem 9)
            if (telLimpo.length < 10 || telLimpo.length > 11) {
                return 'Telefone deve ter entre 10 e 11 dígitos';
            }
            
            return '';
        },
        
        // Validação de documento (arquivo selecionado)
        documento: function(campo) {
            if (!campo.files || campo.files.length === 0) {
                return 'Selecione um documento';
            }
            
            const arquivo = campo.files[0];
            const extensoesValidas = ['.pdf', '.jpg', '.jpeg', '.png'];
            const extensao = '.' + arquivo.name.split('.').pop().toLowerCase();
            
            if (!extensoesValidas.includes(extensao)) {
                return 'Formato de arquivo inválido. Use PDF, JPG ou PNG';
            }
            
            const tamanhoMaximoMB = 5;
            const tamanhoMaximoBytes = tamanhoMaximoMB * 1024 * 1024;
            
            if (arquivo.size > tamanhoMaximoBytes) {
                return `O arquivo deve ter no máximo ${tamanhoMaximoMB}MB`;
            }
            
            return '';
        }
    };
    
    // Máscaras de entrada
    function aplicarMascaras() {
        // Máscara para CPF
        campos.cpf.addEventListener('input', function() {
            let valor = this.value.replace(/\D/g, '');
            if (valor.length > 11) {
                valor = valor.substring(0, 11);
            }
            
            let valorFormatado = '';
            for (let i = 0; i < valor.length; i++) {
                if (i === 3 || i === 6) {
                    valorFormatado += '.';
                } else if (i === 9) {
                    valorFormatado += '-';
                }
                valorFormatado += valor[i];
            }
            
            this.value = valorFormatado;
        });
        
        // Máscara para telefone
        campos.telefone.addEventListener('input', function() {
            let valor = this.value.replace(/\D/g, '');
            if (valor.length > 11) {
                valor = valor.substring(0, 11);
            }
            
            let valorFormatado = '';
            if (valor.length > 0) {
                valorFormatado += '(' + valor.substring(0, 2);
                
                if (valor.length > 2) {
                    valorFormatado += ') ';
                    
                    // Verifica se tem 9 dígitos além do DDD
                    if (valor.length > 10) {
                        valorFormatado += valor.substring(2, 3) + ' ';
                        valorFormatado += valor.substring(3, 7) + '-';
                        valorFormatado += valor.substring(7, 11);
                    } else {
                        valorFormatado += valor.substring(2, 6) + '-';
                        valorFormatado += valor.substring(6, 10);
                    }
                }
            }
            
            this.value = valorFormatado;
        });
        
        // Máscara para data
        campos.data.addEventListener('input', function() {
            let valor = this.value.replace(/\D/g, '');
            if (valor.length > 8) {
                valor = valor.substring(0, 8);
            }
            
            let valorFormatado = '';
            for (let i = 0; i < valor.length; i++) {
                if (i === 2 || i === 4) {
                    valorFormatado += '/';
                }
                valorFormatado += valor[i];
            }
            
            this.value = valorFormatado;
        });
    }
    
    // Aplicar máscaras de entrada
    aplicarMascaras();
    
    // Validar todos os campos
    function validarFormulario() {
        let formValido = true;
        
        // Validar cada campo
        for (const campo in campos) {
            const valor = campo === 'sexo' ? campos[campo].value : campos[campo].value;
            const erro = validadores[campo](campo === 'documento' ? campos[campo] : valor);
            
            if (erro) {
                mostrarErro(campos[campo], erro);
                formValido = false;
            } else {
                removerErro(campos[campo]);
            }
        }
        
        return formValido;
    }
    
    // Salvar dados no localStorage
    function salvarDados() {
        if (!validarFormulario()) {
            return false;
        }
        
        const dadosFormulario = {
            nome: campos.nome.value,
            data: campos.data.value,
            cpf: campos.cpf.value,
            sexo: campos.sexo.value,
            email: campos.email.value,
            telefone: campos.telefone.value,
            documentoSelecionado: campos.documento.files.length > 0
        };
        
        localStorage.setItem('dadosFormulario', JSON.stringify(dadosFormulario));
        mostrarMensagemSucesso('Dados salvos com sucesso!');
        return true;
    }
    
    // Função para carregar dados salvos
    function carregarDados() {
        const dadosSalvos = localStorage.getItem('dadosFormulario');
        if (dadosSalvos) {
            const dados = JSON.parse(dadosSalvos);
            
            // Preencher campos
            for (const campo in dados) {
                if (campo !== 'documentoSelecionado' && campos[campo]) {
                    campos[campo].value = dados[campo];
                }
            }
            
            // Informar sobre documento se estava selecionado
            if (dados.documentoSelecionado) {
                const uploadTexto = document.querySelector('.upload-texto span');
                if (uploadTexto) {
                    uploadTexto.textContent = 'Documento previamente selecionado';
                }
            }
        }
    }
    
    // Impedir envio do formulário se houver erros
    btnProxima.addEventListener('click', function(e) {
        if (!validarFormulario()) {
            e.preventDefault();
        } else {
            // Salvar dados antes de ir para próxima página
            salvarDados();
        }
    });
    
    // Evento para o botão Salvar
    btnSalvar.addEventListener('click', function() {
        salvarDados();
    });
    
    // Estilizar área de upload quando um arquivo é selecionado
    campos.documento.addEventListener('change', function() {
        const uploadTexto = document.querySelector('.upload-texto span');
        
        if (this.files.length > 0) {
            uploadTexto.textContent = this.files[0].name;
            
            // Validar o arquivo
            const erro = validadores.documento(this);
            if (erro) {
                mostrarErro(this, erro);
                uploadTexto.textContent = 'Clique aqui para selecionar o arquivo';
            } else {
                removerErro(this);
            }
        } else {
            uploadTexto.textContent = 'Clique aqui para selecionar o arquivo';
        }
    });
    
    // Carregar dados salvos ao abrir a página
    carregarDados();
    
    // Validação em tempo real
    for (const campo in campos) {
        campos[campo].addEventListener('blur', function() {
            const valor = campo === 'sexo' ? this.value : this.value;
            const erro = validadores[campo](campo === 'documento' ? this : valor);
            
            if (erro) {
                mostrarErro(this, erro);
            } else {
                removerErro(this);
            }
        });
    }
});

