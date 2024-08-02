const fs = require('fs');
const path = require('path');
const cron = require('node-cron');

const lerDadosJson = () => {
    const caminho = path.join(__dirname, 'dados.json');
    try {
        const dados = fs.readFileSync(caminho, 'utf-8');
        return JSON.parse(dados);
    } catch (erro) {
        console.error('Erro ao ler ou analisar o arquivo JSON:', erro);
        return null;
    }
}

const formatarGerador = (gerador) => {
    const painelSolar = `- ID: ${gerador.painelSolar.Id}, Produto: ${gerador.painelSolar.Produto} (${gerador.painelSolar['Potencia em W']}W)`;
    const inversorCorrente = `- ID: ${gerador.inversorCorrente.Id}, Produto: ${gerador.inversorCorrente.Produto} (${gerador.inversorCorrente['Potencia em W']}W)`;
    const controladorCarga = `- ID: ${gerador.controladorCarga.Id}, Produto: ${gerador.controladorCarga.Produto} (${gerador.controladorCarga['Potencia em W']}W)`;

    return `Gerador:
Painel Solar:
${painelSolar}
Inversor de Corrente:
${inversorCorrente}
Controlador de Carga:
${controladorCarga}`;
}

const montarGeradores = () => {
    let pecas = lerDadosJson();
    if (!pecas) {
        console.error("Não foi possível ler os dados JSON.");
        return;
    }

    if (!Array.isArray(pecas)) {
        console.error("Os dados lidos não são um array.");
        return;
    }
    let geradores = [];

    const criaGerador = () => {
        const painelSolares = pecas.filter(p => p.Categoria === 'Painel Solar');
        const inversores = pecas.filter(p => p.Categoria === 'Inversor');
        const controladores = pecas.filter(p => p.Categoria === 'Controlador de carga');
        
        //// verifica se o gerador tera um ou mais paineis solares ,  inversor e controlador 
        if (painelSolares.length >= 1 && inversores && controladores) {
        // Testa combinações de painel solar, inversor e controlador de carga
        for (let i = 0; i < painelSolares.length; i++) {
            const painelSolar = painelSolares[i];
            for (let j = 0; j < inversores.length; j++) {
                const inversor = inversores[j];
                for (let k = 0; k < controladores.length; k++) {
                    const controlador = controladores[k];

                    const potenciaTotalPainelSolar = painelSolar['Potencia em W'];
                    const potenciaInversor = inversor['Potencia em W'];
                    const potenciaControlador = controlador['Potencia em W'];

                   ///verifica se a potencia de todas as pecas sao iguais 
                    if (potenciaTotalPainelSolar === potenciaInversor && potenciaInversor === potenciaControlador) {
                        const gerador = {
                            painelSolar: painelSolar,
                            inversorCorrente: inversor,
                            controladorCarga: controlador
                        };

                        // Remove as peças utilizadas
                        pecas = pecas.filter(p => p !== painelSolar && p !== inversor && p !== controlador);

                        geradores.push(gerador);
                        ///gerador
                        return true; 
                    }
                }
            }
        }
        }else{
            return false; 
        }
    }

    while (criaGerador());

    if (geradores.length > 0) {
        geradores.forEach((gerador, index) => {
            console.log(`Gerador ${index + 1} montado`);
            console.log(formatarGerador(gerador));
        });
    } else {
        console.log('Nenhum gerador foi montado');
    }
}

// Agendar a execução semanalmente (todo domingo às 00:00)
cron.schedule('0 0 * * 0', () => {
    console.log('Iniciando a montagem dos geradores...');
    montarGeradores();
});

