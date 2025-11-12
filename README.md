# 🔗 Encurtador de Links Profissional

Sistema completo de encurtamento de links com Node.js, Express, MongoDB e autenticação JWT.

## ✨ Funcionalidades

### 🆓 Plano Free
- ✅ Encurtar até 100 links por mês
- ✅ Analytics básicos de cliques
- ✅ Links públicos compartilháveis
- ✅ Histórico de 30 dias

### 💎 Plano Premium (R$ 29/mês)
- ✅ Links ilimitados
- ✅ Analytics avançados com gráficos
- ✅ Links personalizados
- ✅ QR Codes
- ✅ Links protegidos por senha
- ✅ Sem anúncios
- ✅ Histórico completo

### 🚀 Plano Business (R$ 99/mês)
- ✅ Tudo do Premium
- ✅ API de acesso
- ✅ Múltiplos usuários
- ✅ White label
- ✅ Domínio personalizado
- ✅ Relatórios customizados

## 🛠️ Tecnologias

- **Backend:** Node.js + Express
- **Banco de Dados:** MongoDB + Mongoose
- **Autenticação:** JWT (JSON Web Tokens)
- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Gráficos:** Chart.js
- **Segurança:** bcryptjs, express-rate-limit

## 📋 Pré-requisitos

- Node.js (v14 ou superior)
- MongoDB (local ou Atlas)
- npm ou yarn

## 🚀 Instalação

### 1. Clone ou baixe o projeto

```bash
cd "caminho/para/encurta link"
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
copy .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
NODE_ENV=development
PORT=5000

# MongoDB Local
MONGODB_URI=mongodb://localhost:27017/encurtador-links

# Ou MongoDB Atlas (cloud gratuito)
# MONGODB_URI=mongodb+srv://seu_usuario:sua_senha@cluster.mongodb.net/encurtador-links

# JWT Secret (MUDE ISSO!)
JWT_SECRET=sua_chave_secreta_muito_segura_aqui_12345

# URLs
FRONTEND_URL=http://localhost:5000
BASE_URL=http://localhost:5000
```

### 4. Inicie o MongoDB

**Windows:**
```bash
net start MongoDB
```

**Linux/Mac:**
```bash
sudo service mongod start
```

**Ou use MongoDB Atlas (cloud gratuito):**
1. Crie conta em https://www.mongodb.com/cloud/atlas
2. Crie um cluster gratuito
3. Pegue a connection string
4. Cole no `.env` como `MONGODB_URI`

### 5. Inicie o servidor

**Modo desenvolvimento (com auto-reload):**
```bash
npm run dev
```

**Modo produção:**
```bash
npm start
```

### 6. Acesse o sistema

Abra seu navegador em: **http://localhost:5000**

## 📁 Estrutura do Projeto

```
encurta link/
│
├── config/
│   └── database.js          # Configuração do MongoDB
│
├── controllers/
│   ├── authController.js    # Login, registro, perfil
│   ├── urlController.js     # CRUD de URLs
│   ├── analyticsController.js  # Estatísticas
│   └── redirectController.js   # Redirecionamento
│
├── middleware/
│   └── auth.js              # Autenticação JWT
│
├── models/
│   ├── User.js              # Schema de usuários
│   └── Url.js               # Schema de URLs
│
├── routes/
│   ├── auth.js              # Rotas de autenticação
│   ├── urls.js              # Rotas de URLs
│   └── analytics.js         # Rotas de analytics
│
├── public/                  # Frontend
│   ├── index.html           # Página principal
│   ├── login.html           # Login
│   ├── register.html        # Registro
│   ├── analytics.html       # Página de analytics
│   ├── pricing.html         # Planos premium
│   ├── 404.html             # Página de erro
│   ├── styles.css           # Estilos
│   └── app.js               # JavaScript principal
│
├── .env                     # Variáveis de ambiente (CRIAR)
├── .env.example             # Exemplo de variáveis
├── .gitignore               # Arquivos ignorados pelo Git
├── package.json             # Dependências
├── server.js                # Servidor principal
└── README.md                # Este arquivo
```

## 🔌 API Endpoints

### Autenticação

- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Fazer login
- `GET /api/auth/profile` - Obter perfil (requer auth)

### URLs

- `POST /api/urls` - Criar link encurtado
- `GET /api/urls` - Listar links do usuário (requer auth)
- `GET /api/urls/:shortCode` - Obter detalhes de um link
- `PUT /api/urls/:shortCode` - Atualizar link (requer auth)
- `DELETE /api/urls/:shortCode` - Deletar link (requer auth)

### Analytics

- `GET /api/analytics/:shortCode` - Analytics de um link
- `GET /api/analytics/user/stats` - Estatísticas do usuário (requer auth)

### Redirecionamento

- `GET /:shortCode` - Redirecionar para URL original

## 💰 Monetização

### 1. Google AdSense

No arquivo `public/index.html`, substitua o placeholder por seu código do AdSense:

```html
<div class="ad-container">
    <!-- Seu código do Google AdSense aqui -->
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXX"
         crossorigin="anonymous"></script>
</div>
```

### 2. Sistema de Pagamentos

Para integrar pagamentos (Stripe, PagSeguro, Mercado Pago):

1. Crie conta no provedor de pagamento
2. Instale o SDK correspondente
3. Crie endpoints de pagamento
4. Atualize o model User para controlar planos

### 3. Limite de Uso

O sistema já controla limites por plano no campo `monthlyLinksLimit` do usuário.

## 🌐 Deploy em Produção

### Heroku

```bash
heroku create seu-encurtador
heroku addons:create mongolab:sandbox
git push heroku main
```

### Vercel

```bash
vercel --prod
```

### VPS (DigitalOcean, AWS, etc)

1. Configure o servidor com Node.js e MongoDB
2. Clone o projeto
3. Configure variáveis de ambiente
4. Use PM2 para manter o servidor rodando:

```bash
npm install -g pm2
pm2 start server.js --name encurtador
pm2 save
pm2 startup
```

### Domínio Personalizado

1. Registre um domínio (ex: seulink.com)
2. Configure DNS apontando para seu servidor
3. Instale certificado SSL (Let's Encrypt gratuito)
4. Atualize BASE_URL no `.env`

## 🔒 Segurança

- ✅ Senhas hasheadas com bcrypt
- ✅ Autenticação JWT
- ✅ Validação de inputs
- ✅ CORS configurado
- ✅ Rate limiting (adicionar se necessário)

## 📊 Analytics

O sistema coleta automaticamente:

- 📅 Data e hora dos cliques
- 🌍 Localização (IP)
- 💻 Dispositivo (Desktop/Mobile/Tablet)
- 🌐 Browser usado
- 💿 Sistema operacional
- 🔗 Origem do tráfego (referer)

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT.

## 💡 Próximas Funcionalidades

- [ ] QR Code generator
- [ ] Exportar analytics em PDF/CSV
- [ ] Integração com redes sociais
- [ ] Sistema de tags para organizar links
- [ ] Dashboard administrativo
- [ ] Notificações por email
- [ ] API pública documentada
- [ ] Testes automatizados
- [ ] Docker compose
- [ ] Integração com Zapier

## 🐛 Problemas Comuns

### MongoDB não conecta

```bash
# Verifique se o MongoDB está rodando
mongod --version

# Inicie o serviço
net start MongoDB  # Windows
sudo service mongod start  # Linux
```

### Porta 5000 já está em uso

Mude a porta no arquivo `.env`:
```env
PORT=3000
```

### Erro "Module not found"

```bash
# Reinstale as dependências
rm -rf node_modules
npm install
```

## 📞 Suporte

- Email: seu@email.com
- Website: https://seusite.com
- GitHub Issues: https://github.com/seu-usuario/projeto/issues

---

**Desenvolvido com ❤️ para ajudar você a monetizar com encurtamento de links!**
