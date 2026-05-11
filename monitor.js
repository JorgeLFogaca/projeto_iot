const mqtt = require('mqtt');

// 1. URL alterada para protocolo WS (WebSocket) e porta 8000
const brokerUrl = 'ws://broker.hivemq.com:8000/mqtt';

// 2. Opções de conexão com Client ID único
const options = {
    clientId: 'monitor_node_' + Math.random().toString(16).substring(2, 8),
    connectTimeout: 30 * 1000, // Aumenta para 30 segundos
    keepalive: 60,
};

const client = mqtt.connect(brokerUrl, options);

const TOPICO = 'projeto_iot/cidade/sensor_esf1';

client.on('connect', () => {
    console.log('✅ Conectado ao HiveMQ via WebSockets!');
    client.subscribe(TOPICO, (err) => {
        if (!err) {
            console.log(`📡 Monitorando: ${TOPICO}`);
        }
    });
});

// O restante da lógica de mensagem (JSON.parse, Alerta) continua IGUAL

client.on('message', (topic, message) => {
    try {
        // converte a mensagem recebida
        const dados = JSON.parse(message.toString());

        console.log(`----------------------------`);
        console.log(`🌡️ Temp: ${dados.temp}°C `);

        if (dados.temp > 7) {
            console.log(`🚨 ALERTA CRÍTICO: ${dados.temp}°C!`);
        } else {
            console.log(`✅ Status: Normal.`);
        }
    } catch (error) {
        // verificando se é um json
        console.log(`⚠️ Mensagem ignorada (não é JSON): "${message.toString()}"`);
    }
});

client.on('error', (err) => {
    console.error('❌ Erro de conexão:', err);
});