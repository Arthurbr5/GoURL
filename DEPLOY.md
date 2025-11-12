# 🚀 DEPLOY DO GOURL - GUIA COMPLETO

## ⚡ OPÇÃO 1: RAILWAY.APP (RECOMENDADO - MAIS FÁCIL)

### **Por que Railway?**
- ✅ 500 horas grátis/mês (suficiente para começar)
- ✅ Deploy super fácil
- ✅ SSL automático (HTTPS)
- ✅ Suporta MongoDB Atlas
- ✅ Domínio grátis: `seuprojeto.railway.app`

---

## 📋 PASSO A PASSO - RAILWAY

### 1. Criar conta no Railway

1. Acesse: https://railway.app
2. Clique em **"Login"**
3. Escolha **"Login with GitHub"** (crie GitHub se não tiver)
4. Autorize o Railway

### 2. Criar novo projeto

1. Clique em **"New Project"**
2. Escolha **"Deploy from GitHub repo"**
3. Se for a primeira vez, conecte sua conta GitHub
4. Clique em **"Deploy"**

**OU:**

1. Clique em **"Deploy from GitHub repo"**
2. Autorize o Railway a acessar seus repositórios
3. Selecione o repositório do GoURL

### 3. Configurar variáveis de ambiente

No painel do Railway:

1. Clique na aba **"Variables"**
2. Adicione cada variável (uma por vez):

```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://arthurbraun512_db_user:Bomdia123@cluster0.bhuwh1p.mongodb.net/encurtador-links?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=mude_esta_chave_secreta_por_uma_mais_segura_12345
FRONTEND_URL=https://seuprojeto.railway.app
BASE_URL=https://seuprojeto.railway.app
```

**IMPORTANTE:** Substitua `seuprojeto` pelo nome real que o Railway der.

### 4. Deploy!

1. Railway vai fazer deploy automático
2. Aguarde 2-5 minutos
3. Clique em **"View Logs"** para acompanhar
4. Quando aparecer "✅ MongoDB conectado", está pronto!

### 5. Acessar seu site

1. Vá na aba **"Settings"**
2. Procure por **"Domains"**
3. Clique em **"Generate Domain"**
4. Copie o link: `https://gourl-production.up.railway.app`
5. **PRONTO! SEU SITE ESTÁ NO AR!** 🎉

---

## ⚡ OPÇÃO 2: RENDER.COM (100% GRÁTIS)

### 1. Criar conta

1. Acesse: https://render.com
2. Cadastre com GitHub

### 2. Novo Web Service

1. Clique em **"New +"**
2. Escolha **"Web Service"**
3. Conecte seu repositório GitHub
4. Configure:
   - **Name:** gourl
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

### 3. Variáveis de ambiente

Adicione as mesmas variáveis do Railway acima.

### 4. Deploy

Clique em **"Create Web Service"** e aguarde!

---

## ⚡ OPÇÃO 3: HEROKU (Requer cartão mas não cobra)

### 1. Criar conta

1. Acesse: https://heroku.com
2. Cadastre-se (vai pedir cartão depois)

### 2. Instalar Heroku CLI

```bash
# Baixe em: https://devcenter.heroku.com/articles/heroku-cli
```

### 3. Deploy via terminal

```bash
# Login
heroku login

# Criar app
heroku create gourl-br

# Configurar variáveis
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI="sua-connection-string"
heroku config:set JWT_SECRET="sua-chave-secreta"
heroku config:set PORT=5000

# Deploy
git init
git add .
git commit -m "Deploy GoURL"
git push heroku main
```

---

## 🔥 SEM GITHUB? USE RAILWAY DIRETO!

### Deploy sem repositório:

1. Instale Railway CLI:
```bash
npm install -g @railway/cli
```

2. No terminal, na pasta do projeto:
```bash
railway login
railway init
railway up
```

3. Configure variáveis no painel web

---

## ✅ APÓS O DEPLOY

### 1. Testar o site
- Acesse a URL gerada
- Registre uma conta
- Encurte um link
- Teste o redirecionamento

### 2. Atualizar BASE_URL no .env
- Vá nas variáveis de ambiente
- Atualize `BASE_URL` com a URL real
- Ex: `https://gourl-production.railway.app`

### 3. Cadastrar no Google AdSense
- Use a URL real do site
- Aguarde aprovação

### 4. Divulgar!
- Compartilhe nas redes sociais
- Crie posts sobre o GoURL
- Ofereça plano free para atrair usuários

---

## 🎯 RECOMENDAÇÃO FINAL

**Use Railway.app** - É o mais fácil e rápido:

1. ✅ Crie conta no Railway
2. ✅ Conecte com GitHub
3. ✅ Faça upload do projeto
4. ✅ Configure variáveis
5. ✅ Deploy automático
6. ✅ Site no ar em 5 minutos!

**Link:** https://railway.app

---

## ❓ PROBLEMAS COMUNS

### "Application Error"
- Verifique as variáveis de ambiente
- Confira os logs no painel

### "Cannot connect to MongoDB"
- Verifique a MONGODB_URI
- Confira se tem caracteres especiais na senha (encode se necessário)

### "Module not found"
- Verifique se `package.json` está correto
- Force rebuild no painel

---

## 💰 CUSTOS

### Railway (Hobby)
- **Grátis:** 500h/mês + $5 crédito
- **Se exceder:** ~$5-10/mês

### Render
- **Grátis:** 100% (mas dorme após 15min sem uso)
- **Pago:** $7/mês (sempre ativo)

### Heroku
- **Grátis:** Acabou em 2022
- **Pago:** $7/mês

---

## 🚀 PRÓXIMO PASSO

**ESCOLHA UMA PLATAFORMA E VAMOS FAZER O DEPLOY AGORA!**

Qual você quer usar?
1. Railway (recomendo)
2. Render
3. Heroku

Me avise e te guio passo a passo! 💪
