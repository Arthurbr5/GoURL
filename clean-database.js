// Script para limpar URLs antigas com customAlias null
const mongoose = require('mongoose');
require('dotenv').config();

async function cleanDatabase() {
  try {
    console.log('🔧 Conectando ao MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado!');

    const db = mongoose.connection.db;
    const urlsCollection = db.collection('urls');

    // Verificar quantos documentos têm customAlias: null
    const count = await urlsCollection.countDocuments({ customAlias: null });
    console.log(`\n📊 Encontrados ${count} documentos com customAlias: null`);

    if (count > 0) {
      // Listar os documentos
      const docs = await urlsCollection.find({ customAlias: null }).toArray();
      console.log('\n📋 URLs que serão limpas:');
      docs.forEach(doc => {
        console.log(`  - ${doc.shortCode} → ${doc.originalUrl}`);
      });

      // Remover o campo customAlias (ao invés de deletar os documentos)
      console.log('\n🧹 Removendo campo customAlias desses documentos...');
      const result = await urlsCollection.updateMany(
        { customAlias: null },
        { $unset: { customAlias: "" } }
      );
      console.log(`✅ ${result.modifiedCount} documentos atualizados!`);
    } else {
      console.log('✅ Nenhum documento problemático encontrado!');
    }

    console.log('\n✅ Limpeza concluída!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

cleanDatabase();
