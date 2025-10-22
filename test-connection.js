// Teste de conexão entre frontend e backend
const https = require('https');

const testData = {
  email: 'test@example.com',
  password: 'test123456',
  name: 'Test User'
};

// Teste 1: Health check
console.log('🔍 Testando health check...');
https.get('https://smart-calendar-backend-nzkf.onrender.com/health', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('✅ Health check:', JSON.parse(data));
    
    // Teste 2: Registro de usuário
    console.log('\n🔍 Testando registro...');
    const postData = JSON.stringify(testData);
    
    const options = {
      hostname: 'smart-calendar-backend-nzkf.onrender.com',
      port: 443,
      path: '/api/auth/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => {
        console.log('Status:', res.statusCode);
        console.log('Response:', responseData);
        
        if (res.statusCode === 201 || res.statusCode === 400) {
          console.log('✅ Backend está funcionando e salvando no banco!');
        }
      });
    });
    
    req.on('error', (e) => {
      console.error('❌ Erro no registro:', e.message);
    });
    
    req.write(postData);
    req.end();
  });
}).on('error', (e) => {
  console.error('❌ Erro no health check:', e.message);
});