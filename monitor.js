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

const TOPICO_GERAL = 'projeto_iot/cidade/#';

client.on('connect', () => {
    console.log('✅ Monitorando Sensores e Status...');
    client.subscribe(TOPICO_GERAL);
});

client.on('message', (topic, message) => {
    const msgStr = message.toString();
    const partes = topic.split('/');
    const sensorId = partes[2];
    const tipoDado = partes[3]; // 'temp' ou 'status'

    if (tipoDado === 'status') {
        // lógica de status on/off
        if (msgStr === 'OFFLINE') {
            console.log(`\n🔴 [ALERTA DE CONEXÃO] O sensor ${sensorId.toUpperCase()} está offline!`);
        } else {
            console.log(`\n🟢 [SISTEMA] O sensor ${sensorId.toUpperCase()} está online.`);
        }
    } 
    
    else if (tipoDado === 'temp') {
        // 
        try {
            const dados = JSON.parse(msgStr);
            const idDoTopico = topic.split('/')[2]; 
        const localNome = dados.local || idDoTopico;

        console.log(`------------------------------------------`);
        console.log(`📍 Origem: ${idDoTopico.toUpperCase()}`);
        console.log(`🌡️  Temperatura: ${dados.temp}°C`);
        console.log(`📢 Status: ${dados.alerta}`);
        //lógica de alerta
        if (dados.temp > 7) {
            console.log(`🚨 ALERTA ATIVO EM: ${localNome.toUpperCase()}`);
        }
    } catch (error) {
        console.log(`⚠️ Erro ao processar JSON: ${message.toString()}`);
    }
    }
});