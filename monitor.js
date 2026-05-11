const mqtt = require('mqtt');

// protocolo ws na porta 8000
const brokerUrl = 'ws://broker.hivemq.com:8000/mqtt';

// conexão com client id único
const options = {
    clientId: 'monitor_node_' + Math.random().toString(16).substring(2, 8),
    connectTimeout: 30 * 1000, // 30 segundos para o handshake
    keepalive: 60,
};

const client = mqtt.connect(brokerUrl, options);

const TOPICO = 'projeto_iot/cidade/+/temp';

client.on('connect', () => {
    console.log('✅ Conectado ao HiveMQ via WebSockets!');
    client.subscribe(TOPICO, (err) => {
        if (!err) {
            console.log(`📡 Monitorando: ${TOPICO}`);
        }
    });
});

// lógica mensagem de alerta com verificação de json

client.on('message', (topic, message) => {
    try {
        const dados = JSON.parse(message.toString());
        
        // Extrai 'sensor_esf1' ou 'sensor_esf2' direto da URL do tópico
        const idDoTopico = topic.split('/')[2]; 
        const localNome = dados.local || idDoTopico;

        console.log(`------------------------------------------`);
        console.log(`📍 Origem: ${idDoTopico.toUpperCase()}`);
        console.log(`🌡️  Temperatura: ${dados.temp}°C`);
        console.log(`📢 Status: ${dados.alerta}`);

        if (dados.temp > 7) {
            console.log(`🚨 ALERTA ATIVO EM: ${localNome.toUpperCase()}`);
        }
    } catch (error) {
        console.log(`⚠️ Erro ao processar JSON: ${message.toString()}`);
    }
});

client.on('error', (err) => {
    console.error('❌ Erro de conexão:', err);
});