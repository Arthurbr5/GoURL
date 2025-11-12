// Script para corrigir índices duplicados no MongoDB
const mongoose = require('mongoose');
require('dotenv').config();

async function fixIndexes() {
  try {
    console.log('🔧 Conectando ao MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado!');

    const db = mongoose.connection.db;
    const collection = db.collection('urls');

    console.log('📋 Índices atuais:');
    const indexes = await collection.indexes();
    console.log(JSON.stringify(indexes, null, 2));

    console.log('\n🗑️ Removendo índice problemático do customAlias...');
    try {
      await collection.dropIndex('customAlias_1');
      console.log('✅ Índice antigo removido!');
    } catch (error) {
      console.log('⚠️ Índice não existe ou já foi removido');
    }

    console.log('\n🔨 Recriando índice correto (sparse)...');
    await collection.createIndex({ customAlias: 1 }, { unique: true, sparse: true });
    console.log('✅ Índice sparse criado!');

    console.log('\n📋 Novos índices:');
    const newIndexes = await collection.indexes();
    console.log(JSON.stringify(newIndexes, null, 2));

    console.log('\n✅ Pronto! Banco corrigido.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

fixIndexes();
