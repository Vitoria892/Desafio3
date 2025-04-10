// Lista de estados brasileiros (siglas e nomes completos)
const estadosBrasileiros = {
    'AC': 'Acre',
    'AL': 'Alagoas',
    'AP': 'Amapá',
    'AM': 'Amazonas',
    'BA': 'Bahia',
    'CE': 'Ceará',
    'DF': 'Distrito Federal',
    'ES': 'Espírito Santo',
    'GO': 'Goiás',
    'MA': 'Maranhão',
    'MT': 'Mato Grosso',
    'MS': 'Mato Grosso do Sul',
    'MG': 'Minas Gerais',
    'PA': 'Pará',
    'PB': 'Paraíba',
    'PR': 'Paraná',
    'PE': 'Pernambuco',
    'PI': 'Piauí',
    'RJ': 'Rio de Janeiro',
    'RN': 'Rio Grande do Norte',
    'RS': 'Rio Grande do Sul',
    'RO': 'Rondônia',
    'RR': 'Roraima',
    'SC': 'Santa Catarina',
    'SP': 'São Paulo',
    'SE': 'Sergipe',
    'TO': 'Tocantins'
};

// Elementos do formulário
const form = document.getElementById('formulario-endereco');
const cepInput = document.getElementById('cep');
const numeroInput = document.getElementById('numero');
const cidadeInput = document.getElementById('cidade');
const estadoInput = document.getElementById('estado');
const ruaInput = document.getElementById('rua');
const comprovanteInput = document.getElementById('comprovante');
const proximaBtn = document.querySelector('.proxima');
const salvarBtn = document.querySelector('.salvar');
const uploadTexto = document.querySelector('.upload-texto span');

// Variável para controlar salvamento automático
let tempoSalvamentoAutomatico;
const INTERVALO_SALVAMENTO = 30000; // 30 segundos

// Função para mostrar alertas
function mostrarAlerta(mensagem, elemento) {
    // Remove alertas anteriores
    const alertaExistente = elemento.parentNode.querySelector('.alerta-erro');
    if (alertaExistente) {
        alertaExistente.remove();
    }
    
    // Cria novo alerta
    const alerta = document.createElement('div');
    alerta.className = 'alerta-erro';
    alerta.textContent = mensagem;
    
    // Insere alerta após o elemento
    elemento.parentNode.insertBefore(alerta, elemento.nextSibling);
    
    // Adiciona classe de erro ao input
    elemento.classList.add('input-erro');
}

// Função para remover alertas
function removerAlerta(elemento) {
    const alertaExistente = elemento.parentNode.querySelector('.alerta-erro');
    if (alertaExistente) {
        alertaExistente.remove();
    }
    elemento.classList.remove('input-erro');
}

// Função para salvar dados temporariamente
function salvarRascunho() {
    const dadosTemporarios = {
        cep: cepInput.value,
        rua: ruaInput.value,
        numero: numeroInput.value,
        cidade: cidadeInput.value,
        estado: estadoInput.value,
        temComprovante: comprovanteInput.files.length > 0
    };
    
    localStorage.setItem('enderecoRascunho', JSON.stringify(dadosTemporarios));
    
    // Mostrar feedback temporário
    const feedbackElement = document.createElement('div');
    feedbackElement.className = 'feedback-salvamento';
    feedbackElement.textContent = 'Dados salvos com sucesso!';
    feedbackElement.style.position = 'fixed';
    feedbackElement.style.bottom = '20px';
    feedbackElement.style.right = '20px';
    feedbackElement.style.padding = '10px 20px';
    feedbackElement.style.backgroundColor = '#4CAF50';
    feedbackElement.style.color = 'white';
    feedbackElement.style.borderRadius = '4px';
    feedbackElement.style.zIndex = '1000';
    document.body.appendChild(feedbackElement);
    
    // Remover feedback após 3 segundos
    setTimeout(() => {
        feedbackElement.remove();
    }, 3000);
}

// Função para recuperar dados salvos
function recuperarDados() {
    const dadosSalvos = localStorage.getItem('enderecoRascunho');
    if (dadosSalvos) {
        const dados = JSON.parse(dadosSalvos);
        
        // Preencher os campos com os dados salvos
        if (dados.cep) cepInput.value = dados.cep;
        if (dados.rua) ruaInput.value = dados.rua;
        if (dados.numero) numeroInput.value = dados.numero;
        if (dados.cidade) cidadeInput.value = dados.cidade;
        if (dados.estado) estadoInput.value = dados.estado;
        
        // Atualizar a UI para mostrar que os dados foram recuperados
        if (dados.temComprovante) {
            uploadTexto.textContent = 'Arquivo anteriormente selecionado';
            uploadTexto.style.fontStyle = 'italic';
        }
        
        // Criar notificação de recuperação
        const notificacao = document.createElement('div');
        notificacao.className = 'notificacao-recuperacao';
        notificacao.textContent = 'Seus dados preenchidos anteriormente foram recuperados.';
        notificacao.style.backgroundColor = '#E3F2FD';
        notificacao.style.color = '#1976D2';
        notificacao.style.padding = '10px';
        notificacao.style.borderRadius = '4px';
        notificacao.style.margin = '10px 0';
        
        // Adicionar botão para limpar dados recuperados
        const btnLimpar = document.createElement('button');
        btnLimpar.textContent = 'Limpar dados';
        btnLimpar.style.marginLeft = '10px';
        btnLimpar.style.padding = '5px 10px';
        btnLimpar.style.backgroundColor = '#FFF';
        btnLimpar.style.border = '1px solid #1976D2';
        btnLimpar.style.borderRadius = '4px';
        btnLimpar.style.cursor = 'pointer';
        
        btnLimpar.addEventListener('click', () => {
            form.reset();
            localStorage.removeItem('enderecoRascunho');
            notificacao.remove();
            uploadTexto.textContent = 'Clique aqui para selecionar o arquivo';
            uploadTexto.style.fontStyle = 'normal';
        });
        
        notificacao.appendChild(btnLimpar);
        form.insertBefore(notificacao, form.firstChild);
    }
}

// Iniciar salvamento automático quando qualquer campo for alterado
function iniciarSalvamentoAutomatico() {
    // Limpar temporizador anterior
    clearTimeout(tempoSalvamentoAutomatico);
    
    // Definir novo temporizador
    tempoSalvamentoAutomatico = setTimeout(() => {
        salvarRascunho();
    }, INTERVALO_SALVAMENTO);
}

// Validação do CEP (00000-000)
cepInput.addEventListener('input', function() {
    // Formata automaticamente o CEP ao digitar
    let cep = this.value.replace(/\D/g, ''); // Remove não-números
    
    if (cep.length > 5) {
        cep = cep.substring(0, 5) + '-' + cep.substring(5);
    }
    
    this.value = cep.substring(0, 9); // Limita a 9 caracteres (00000-000)
    iniciarSalvamentoAutomatico();
});

cepInput.addEventListener('blur', function() {
    const cepPattern = /^\d{5}-\d{3}$/;
    
    if (!this.value) {
        mostrarAlerta('O CEP é obrigatório.', this);
        return;
    }
    
    if (!cepPattern.test(this.value)) {
        mostrarAlerta('O CEP deve estar no formato 00000-000.', this);
    } else {
        removerAlerta(this);
    }
});

// Validação do Número (apenas números)
numeroInput.addEventListener('blur', function() {
    if (!this.value) {
        mostrarAlerta('O Número é obrigatório.', this);
        return;
    }
    
    // Verifica se contém apenas números
    if (!/^\d+$/.test(this.value)) {
        mostrarAlerta('Digite apenas números no campo Número.', this);
    } else {
        removerAlerta(this);
    }
});

numeroInput.addEventListener('input', iniciarSalvamentoAutomatico);

// Validação do campo Cidade (apenas letras e caracteres especiais permitidos)
cidadeInput.addEventListener('blur', function() {
    if (!this.value) {
        mostrarAlerta('A Cidade é obrigatória.', this);
        return;
    }
    
    // Verifica se contém apenas letras, espaços, traços, apóstrofos e pontos
    if (!/^[a-zA-ZÀ-ú\s\-\'\.]+$/.test(this.value)) {
        mostrarAlerta('Digite apenas um nome de cidade válido.', this);
    } else {
        removerAlerta(this);
        // Capitaliza a primeira letra de cada palavra
        this.value = this.value.replace(/\b\w/g, c => c.toUpperCase());
    }
});

cidadeInput.addEventListener('input', iniciarSalvamentoAutomatico);

// Validação do Estado
estadoInput.addEventListener('blur', function() {
    if (!this.value) {
        mostrarAlerta('O Estado é obrigatório.', this);
        return;
    }
    
    const estadoDigitado = this.value.trim().toUpperCase();
    let estadoValido = false;
    
    // Verifica se é uma sigla válida
    if (estadosBrasileiros[estadoDigitado]) {
        estadoValido = true;
    } else {
        // Verifica se é um nome de estado válido
        for (const sigla in estadosBrasileiros) {
            if (estadosBrasileiros[sigla].toUpperCase() === estadoDigitado) {
                // Substituir pelo valor da sigla
                this.value = sigla;
                estadoValido = true;
                break;
            }
        }
    }
    
    if (!estadoValido) {
        mostrarAlerta('Digite uma sigla válida (ex: SP) ou nome de um estado brasileiro.', this);
    } else {
        removerAlerta(this);
        // Converte para maiúsculas se for sigla
        if (this.value.length <= 2) {
            this.value = this.value.toUpperCase();
        }
    }
});

estadoInput.addEventListener('input', iniciarSalvamentoAutomatico);

// Detectar alterações em outros campos do formulário
ruaInput.addEventListener('input', iniciarSalvamentoAutomatico);

// Atualiza o texto do upload quando arquivo é selecionado
comprovanteInput.addEventListener('change', function() {
    if (this.files.length > 0) {
        uploadTexto.textContent = this.files[0].name;
        uploadTexto.style.fontStyle = 'normal';
        removerAlerta(this);
        iniciarSalvamentoAutomatico();
    } else {
        uploadTexto.textContent = 'Clique aqui para selecionar o arquivo';
    }
});

// Validação ao submeter o formulário
form.addEventListener('submit', function(e) {
    e.preventDefault();
    let formValido = true;
    
    // Valida CEP
    const cepPattern = /^\d{5}-\d{3}$/;
    if (!cepInput.value || !cepPattern.test(cepInput.value)) {
        mostrarAlerta('O CEP deve estar no formato 00000-000.', cepInput);
        formValido = false;
    }
    
    // Valida Número
    if (!numeroInput.value || !/^\d+$/.test(numeroInput.value)) {
        mostrarAlerta('Digite apenas números no campo Número.', numeroInput);
        formValido = false;
    }
    
    // Valida Cidade
    if (!cidadeInput.value || !/^[a-zA-ZÀ-ú\s\-\'\.]+$/.test(cidadeInput.value)) {
        mostrarAlerta('Digite apenas um nome de cidade válido.', cidadeInput);
        formValido = false;
    }
    
    // Valida Estado
    const estadoDigitado = estadoInput.value.trim().toUpperCase();
    let estadoValido = false;
    
    if (estadosBrasileiros[estadoDigitado]) {
        estadoValido = true;
    } else {
        for (const sigla in estadosBrasileiros) {
            if (estadosBrasileiros[sigla].toUpperCase() === estadoDigitado) {
                estadoValido = true;
                break;
            }
        }
    }
    
    if (!estadoValido) {
        mostrarAlerta('Digite uma sigla válida (ex: SP) ou nome de um estado brasileiro.', estadoInput);
        formValido = false;
    }
    
    // Valida comprovante
    if (!comprovanteInput.files.length) {
        mostrarAlerta('Selecione um comprovante de residência.', comprovanteInput);
        formValido = false;
    }
    
    // Se tudo estiver válido, salva o formulário e avança
    if (formValido) {
        // Salva os dados finais no localStorage
        const dadosEndereco = {
            cep: cepInput.value,
            rua: ruaInput.value,
            numero: numeroInput.value,
            cidade: cidadeInput.value,
            estado: estadoInput.value,
            comprovante: comprovanteInput.files[0].name
        };
        
        localStorage.setItem('dadosEndereco', JSON.stringify(dadosEndereco));
        localStorage.removeItem('enderecoRascunho'); // Remove o rascunho após salvar definitivamente
        
        // Exibe confirmação antes de prosseguir
        alert('Dados salvos com sucesso!');
        
        // Redireciona para a próxima página
        window.location.href = 'pagina3.html';
    }
});

// Botão salvar rascunho
if (salvarBtn) {
    salvarBtn.addEventListener('click', function() {
        salvarRascunho();
    });
}

// Configura o botão "Próxima" para validar e enviar o formulário
proximaBtn.addEventListener('click', function(e) {
    e.preventDefault();
    form.dispatchEvent(new Event('submit'));
});

// Recuperar dados ao carregar a página
window.addEventListener('DOMContentLoaded', function() {
    recuperarDados();
    
    // Configurar evento para salvar dados ao fechar a página inesperadamente
    window.addEventListener('beforeunload', function() {
        salvarRascunho();
    });
});