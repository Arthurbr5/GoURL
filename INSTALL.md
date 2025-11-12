# 🚀 GUIA RÁPIDO DE INSTALAÇÃO

## ⚡ Instalação Express (5 minutos)

### 1️⃣ Instalar Node.js
- Baixe em: https://nodejs.org/
- Instale a versão LTS (recomendada)
- Verifique: `node --version`

### 2️⃣ Instalar MongoDB

**Opção A: MongoDB Local (Windows)**
```bash
# Baixe em: https://www.mongodb.com/try/download/community
# Instale normalmente
# Inicie o serviço:
net start MongoDB
```

**Opção B: MongoDB Atlas (Cloud GRATUITO - Recomendado)**
1. Acesse: https://www.mongodb.com/cloud/atlas
2. Crie conta gratuita
3. Crie cluster gratuito (M0)
4. Clique em "Connect" > "Connect your application"
5. Copie a connection string
6. Cole no arquivo .env

### 3️⃣ Configurar o Projeto

```bash
# Abra o PowerShell na pasta do projeto
cd "c:\Users\Alucard69\Documents\BeamNG.drive\settings\encurta link"

# Instale as dependências
npm install

# Copie o arquivo de exemplo
copy .env.example .env

# Edite o .env com suas configurações
notepad .env
```

### 4️⃣ Configurar .env

Abra o arquivo `.env` e configure:

```env
# Porta do servidor
PORT=5000

# MongoDB - ESCOLHA UMA OPÇÃO:

# Opção A: MongoDB Local
MONGODB_URI=mongodb://localhost:27017/encurtador-links

# Opção B: MongoDB Atlas (substitua com sua string)
# MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/encurtador-links

# Chave secreta JWT (MUDE ISSO!)
JWT_SECRET=sua_chave_super_secreta_12345_mude_isso

# URLs
BASE_URL=http://localhost:5000
```

### 5️⃣ Iniciar o Servidor

```bash
# Desenvolvimento (com auto-reload)
npm run dev

# Ou produção
npm start
```

### 6️⃣ Acessar

Abra seu navegador em: **http://localhost:5000**

---

## 🔧 Solução de Problemas

### ❌ "npm não é reconhecido"
- Reinstale o Node.js
- Reinicie o terminal

### ❌ "Cannot connect to MongoDB"
- **MongoDB Local:** Execute `net start MongoDB`
- **MongoDB Atlas:** Verifique sua connection string no .env

### ❌ Porta 5000 ocupada
- Mude `PORT=3000` no .env

### ❌ Erro ao instalar dependências
```bash
npm cache clean --force
npm install
```

---

## 📦 Dependências Instaladas

Após `npm install`, você terá:

- ✅ express - Framework web
- ✅ mongoose - ODM para MongoDB
- ✅ jsonwebtoken - Autenticação JWT
- ✅ bcryptjs - Hash de senhas
- ✅ dotenv - Variáveis de ambiente
- ✅ cors - Cross-Origin Resource Sharing
- ✅ validator - Validação de dados
- ✅ nanoid - Gerador de IDs curtos
- ✅ nodemon - Auto-reload em desenvolvimento

---

## 🎯 Próximos Passos

1. ✅ Instale e inicie o servidor
2. ✅ Registre uma conta
3. ✅ Encurte seu primeiro link
4. ✅ Veja os analytics
5. 💰 Configure Google AdSense
6. 🚀 Faça deploy em produção
7. 💳 Integre sistema de pagamento

---

## 💡 Dicas de Monetização

### 1. Google AdSense
- Cadastre-se: https://www.google.com/adsense
- Adicione seu código em `public/index.html`
- Ganhe por visualizações e cliques

### 2. Planos Premium
- Free: Ganhe tráfego inicial
- Premium R$ 29/mês: Sua principal fonte de renda
- Business R$ 99/mês: Para grandes empresas

### 3. Marketing
- Divulgue em redes sociais
- Faça anúncios no Google/Facebook
- Ofereça trial gratuito de 7 dias
- Crie conteúdo sobre encurtamento de links

### 4. Integrações
- Ofereça API para desenvolvedores
- Integre com ferramentas populares
- Crie plugins para WordPress, etc

---

## 🌐 Deploy Gratuito

### Heroku (Gratuito)
```bash
# Instale Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

heroku login
heroku create meu-encurtador
heroku addons:create mongolab:sandbox
git init
git add .
git commit -m "Initial commit"
git push heroku main
```

### Vercel (Gratuito)
```bash
npm install -g vercel
vercel login
vercel --prod
```

---

**Pronto! Seu encurtador profissional está funcionando! 🎉**

Qualquer dúvida, consulte o README.md completo.
