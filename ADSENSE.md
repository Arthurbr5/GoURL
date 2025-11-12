# 📢 GUIA: COMO ADICIONAR GOOGLE ADSENSE NO GOURL

## 🎯 PASSO A PASSO COMPLETO

### 1️⃣ **Cadastrar no Google AdSense**

1. Acesse: https://www.google.com/adsense
2. Clique em "Começar"
3. Faça login com sua conta Google
4. Preencha os dados:
   - URL do site (use `localhost:5000` por enquanto, ou seu domínio futuro)
   - País
   - Aceite os termos

### 2️⃣ **Obter o Código Global**

Após se cadastrar, o AdSense vai te dar um código assim:

```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
     crossorigin="anonymous"></script>
```

**ONDE COLAR:**
- Arquivo: `public/index.html`
- Local: Dentro do `<head>`, onde está o comentário `<!-- Google AdSense - COLE SEU CÓDIGO AQUI -->`

### 3️⃣ **Criar Unidades de Anúncio**

No painel do AdSense:
1. Vá em **"Anúncios"** > **"Por unidade de anúncio"**
2. Clique em **"Criar unidade de anúncio"**
3. Escolha **"Anúncio gráfico"**
4. Configure:
   - Nome: "GoURL Banner Principal"
   - Tamanho: "Responsivo"
5. Clique em **"Criar"**
6. **COPIE O CÓDIGO** gerado

### 4️⃣ **Colar os Códigos de Anúncio**

O código será parecido com isso:

```html
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
     data-ad-slot="XXXXXXXXXX"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
```

**SUBSTITUIR EM 2 LUGARES no `index.html`:**

#### Local 1: Banner Principal (linha ~47)
Procure por:
```html
<!-- SUBSTITUA ESTE BLOCO pelo código de anúncio do AdSense -->
```
Substitua o placeholder pelo código do AdSense.

#### Local 2: Banner Rodapé (linha ~73)
Procure por:
```html
<!-- COLE AQUI outro código de anúncio do AdSense -->
```
Cole outro código de anúncio aqui.

---

## ⚠️ **IMPORTANTE:**

### **Antes de Aprovar AdSense:**
- ❌ Não funciona em `localhost`
- ❌ Precisa de domínio real (ex: gourl.com.br)
- ❌ Site precisa estar no ar (fazer deploy)
- ❌ Precisa ter conteúdo original

### **Para Aprovar AdSense:**
1. ✅ Faça deploy do site (Heroku/Vercel)
2. ✅ Tenha domínio próprio (gourl.com.br)
3. ✅ Adicione política de privacidade
4. ✅ Tenha pelo menos 20-30 páginas/conteúdo
5. ✅ Aguarde aprovação (1-7 dias)

---

## 💰 **QUANTO VOU GANHAR?**

### **Estimativas Realistas:**

- **100 visitantes/dia** = R$ 10-30/mês
- **500 visitantes/dia** = R$ 50-150/mês
- **1.000 visitantes/dia** = R$ 100-300/mês
- **5.000 visitantes/dia** = R$ 500-1.500/mês

**Depende de:**
- Nicho (marketing digital paga mais)
- Localização (Brasil paga menos que EUA)
- Taxa de clique (CTR)
- CPC (custo por clique)

---

## 📝 **EXEMPLO PRÁTICO:**

### Código completo no `<head>`:

```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GoURL - Encurtador de Links Profissional</title>
    <link rel="stylesheet" href="styles.css">
    
    <!-- Google AdSense -->
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456"
         crossorigin="anonymous"></script>
</head>
```

### Código de anúncio no corpo:

```html
<div class="ad-container">
    <ins class="adsbygoogle"
         style="display:block"
         data-ad-client="ca-pub-1234567890123456"
         data-ad-slot="9876543210"
         data-ad-format="auto"
         data-full-width-responsive="true"></ins>
    <script>
         (adsbygoogle = window.adsbygoogle || []).push({});
    </script>
</div>
```

---

## 🚀 **PRÓXIMOS PASSOS:**

1. ✅ Cadastre no AdSense HOJE
2. ✅ Faça deploy do site
3. ✅ Compre domínio
4. ✅ Adicione os códigos
5. ✅ Aguarde aprovação
6. ✅ Comece a ganhar!

---

## 📊 **ALTERNATIVAS AO ADSENSE:**

Se não aprovar AdSense, use:
- **Adsterra** - Aprova fácil
- **PropellerAds** - Aceita qualquer site
- **Monetag** - Rápido de aprovar
- **Media.net** - Similar ao AdSense

---

**Qualquer dúvida, leia a documentação do AdSense ou me pergunte!** 💪
