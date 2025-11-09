const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Generate a test RSA key pair
function generateKeyPair() {
    return crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem',
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
        },
    });
}

// Generate the JWT token
function generateTestToken() {
    const { publicKey, privateKey } = generateKeyPair();

    // Use the exact token creation code you provided
    var idToken = jwt.sign(
        {
            sub: 'stvnbvsts@gmail.com', // Add this back - use email as sub
            email: 'stvnbvsts@gmail.com',
            name: 'Steven Bustos',
            aud: 'urn:rampa-web3auth',
            iss: 'https://auth.rampa.local',
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 60 * 60,
        },
        privateKey,
        { algorithm: 'RS256', keyid: 'key-v1' }
    );

    console.log('🔑 Generated JWT Token:');
    console.log(idToken);
    console.log('\n📋 Token Details:');
    console.log(
        'Payload:',
        JSON.stringify(
            {
                sub: 'stvnbvsts@gmail.com',
                email: 'stvnbvsts@gmail.com',
                name: 'Steven Bustos',
                aud: 'urn:rampa-web3auth',
                iss: 'https://auth.rampa.local',
                iat: Math.floor(Date.now() / 1000),
                exp: Math.floor(Date.now() / 1000) + 60 * 60,
            },
            null,
            2
        )
    );
    console.log('\n🔐 Public Key (for verification):');
    console.log(publicKey);
    console.log('\n🔒 Private Key (for signing):');
    console.log(privateKey);

    return { token: idToken, publicKey, privateKey };
}

// Test the token with your backend
async function testTokenWithBackend(token) {
    const backendUrl = 'https://api-rampa-cash-test.up.railway.app';

    try {
        console.log('\n🧪 Testing token with backend...');

        const response = await fetch(`${backendUrl}/auth/web3auth/validate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: token,
            }),
        });

        console.log('📡 Response Status:', response.status);
        console.log(
            '📡 Response Headers:',
            Object.fromEntries(response.headers.entries())
        );

        if (response.ok) {
            const data = await response.json();
            console.log('✅ Success! Backend Response:');
            console.log(JSON.stringify(data, null, 2));
        } else {
            const errorText = await response.text();
            console.log('❌ Error Response:');
            console.log(errorText);
        }
    } catch (error) {
        console.error('❌ Network Error:', error.message);
    }
}

// Main execution
async function main() {
    console.log('🚀 Generating test JWT token...\n');

    const { token, publicKey, privateKey } = generateTestToken();

    console.log('\n' + '='.repeat(80));
    console.log('📝 Copy this token to test in your frontend:');
    console.log('='.repeat(80));
    console.log(token);
    console.log('='.repeat(80));

    // Test with backend
    await testTokenWithBackend(token);
}

// Run the script
main().catch(console.error);
