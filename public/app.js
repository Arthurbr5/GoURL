// Configuração da API
const API_URL = 'http://localhost:5000/api';
let authToken = localStorage.getItem('authToken');

// Funções de autenticação
function isAuthenticated() {
    return !!authToken;
}

function setAuthToken(token) {
    authToken = token;
    localStorage.setItem('authToken', token);
}

function clearAuthToken() {
    authToken = null;
    localStorage.removeItem('authToken');
}

// Função para fazer requisições à API
async function apiRequest(endpoint, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Erro na requisição');
        }

        return data;
    } catch (error) {
        console.error('Erro na API:', error);
        throw error;
    }
}

// Validar URL
function isValidUrl(string) {
    try {
        const url = new URL(string);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
        return false;
    }
}

// Função principal para encurtar URL
async function shortenUrl() {
    const urlInput = document.getElementById('urlInput');
    const resultDiv = document.getElementById('result');
    const errorDiv = document.getElementById('error');
    const originalUrl = urlInput.value.trim();

    // Limpar mensagens anteriores
    resultDiv.classList.add('hidden');
    errorDiv.classList.add('hidden');

    // Validar URL
    if (!originalUrl) {
        showError('Por favor, insira uma URL válida.');
        return;
    }

    if (!isValidUrl(originalUrl)) {
        showError('URL inválida. Certifique-se de incluir http:// ou https://');
        return;
    }

    try {
        // Desabilitar botão enquanto processa
        const btn = document.getElementById('shortenBtn');
        btn.disabled = true;
        btn.textContent = 'Encurtando...';

        // Fazer requisição à API
        const response = await apiRequest('/urls', {
            method: 'POST',
            body: JSON.stringify({ originalUrl })
        });

        // Mostrar resultado
        document.getElementById('shortenedUrl').value = response.data.shortUrl;
        document.getElementById('originalUrl').textContent = originalUrl;
        resultDiv.classList.remove('hidden');

        // Limpar input
        urlInput.value = '';

        // Atualizar lista
        await displayLinks();

        // Reabilitar botão
        btn.disabled = false;
        btn.textContent = 'Encurtar Link';

    } catch (error) {
        showError(error.message || 'Erro ao encurtar link. Tente novamente.');
        const btn = document.getElementById('shortenBtn');
        btn.disabled = false;
        btn.textContent = 'Encurtar Link';
    }
}

// Mostrar erro
function showError(message) {
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
}

// Copiar para área de transferência
function copyToClipboard() {
    const shortenedUrl = document.getElementById('shortenedUrl');
    shortenedUrl.select();
    shortenedUrl.setSelectionRange(0, 99999);
    
    navigator.clipboard.writeText(shortenedUrl.value).then(() => {
        const button = event.target;
        const originalText = button.textContent;
        button.textContent = '✅ Copiado!';
        button.style.background = '#10b981';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 2000);
    }).catch(err => {
        console.error('Erro ao copiar:', err);
        alert('Erro ao copiar. Tente selecionar e copiar manualmente.');
    });
}

// Copiar link específico da lista
function copyLink(shortUrl) {
    navigator.clipboard.writeText(shortUrl).then(() => {
        const button = event.target;
        const originalText = button.textContent;
        button.textContent = '✅ Copiado!';
        
        setTimeout(() => {
            button.textContent = originalText;
        }, 2000);
    });
}

// Deletar link
async function deleteLink(shortCode) {
    if (!confirm('Tem certeza que deseja deletar este link?')) {
        return;
    }

    if (!isAuthenticated()) {
        showError('Você precisa estar logado para deletar links.');
        return;
    }

    try {
        await apiRequest(`/urls/${shortCode}`, {
            method: 'DELETE'
        });
        
        await displayLinks();
    } catch (error) {
        showError(error.message || 'Erro ao deletar link.');
    }
}

// Ver analytics
function viewAnalytics(shortCode) {
    window.location.href = `analytics.html?code=${shortCode}`;
}

// Exibir lista de links
async function displayLinks() {
    const linksList = document.getElementById('linksList');

    if (!isAuthenticated()) {
        linksList.innerHTML = `
            <div class="no-links">
                <p style="font-size: 1.2em; margin-bottom: 15px;">🔐 Faça login para ver seus links salvos</p>
                <button onclick="window.location.href='login.html'" style="padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;">
                    Fazer Login
                </button>
            </div>
        `;
        return;
    }

    try {
        const response = await apiRequest('/urls');
        const urls = response.data;

        if (urls.length === 0) {
            linksList.innerHTML = '<div class="no-links">Nenhum link encurtado ainda. Comece encurtando seu primeiro link!</div>';
            return;
        }

        linksList.innerHTML = urls.map(url => {
            const date = new Date(url.createdAt).toLocaleDateString('pt-BR');
            
            return `
                <div class="link-item">
                    <div class="link-item-short">🔗 ${url.shortUrl}</div>
                    <div class="link-item-original">➡️ ${url.originalUrl}</div>
                    <div style="font-size: 12px; color: #999; margin-top: 5px;">
                        📅 Criado em: ${date} | 👆 Cliques: ${url.clicks}
                    </div>
                    <div class="link-item-actions">
                        <button class="copy-btn" onclick="copyLink('${url.shortUrl}')">📋 Copiar</button>
                        <button class="copy-btn" onclick="viewAnalytics('${url.shortCode}')">📊 Analytics</button>
                        <button class="delete-btn" onclick="deleteLink('${url.shortCode}')">🗑️ Deletar</button>
                    </div>
                </div>
            `;
        }).join('');

    } catch (error) {
        console.error('Erro ao listar links:', error);
        linksList.innerHTML = '<div class="no-links">Erro ao carregar links. Tente novamente.</div>';
    }
}

// Atualizar UI de autenticação
function updateAuthUI() {
    const authSection = document.getElementById('authSection');
    
    if (isAuthenticated()) {
        authSection.innerHTML = `
            <button onclick="logout()" class="auth-btn">🚪 Sair</button>
        `;
    } else {
        authSection.innerHTML = `
            <button onclick="window.location.href='login.html'" class="auth-btn">🔐 Login</button>
            <button onclick="window.location.href='register.html'" class="auth-btn primary">✨ Registrar</button>
        `;
    }
}

// Logout
function logout() {
    clearAuthToken();
    updateAuthUI();
    displayLinks();
    showError('Você saiu da sua conta.');
}

// Permitir encurtar com Enter
document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('urlInput');
    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            shortenUrl();
        }
    });

    // Atualizar UI e carregar links
    updateAuthUI();
    displayLinks();
});
