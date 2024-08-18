# Projeto de Automação de Gerador

Este projeto é uma automação para montar um gerador com base em um arquivo JSON contendo várias peças. O objetivo é garantir que as peças necessárias estejam presentes e que todas as peças dentro de cada tipo (painéis solares, inversores e controladores) atendam a requisitos específicos de potência e marca.

## Descrição

O script realiza as seguintes verificações:
- Há pelo menos um painel solar.
- Há exatamente um inversor.
- Há exatamente um controlador.
- Todas as peças de painel solar têm a mesma potência e marca.
- O inversor e o controlador também devem ter a mesma potência e marca.

## Requisitos

- Node.js (versão 20 ou superior)
- npm (versão 10 ou superior)
