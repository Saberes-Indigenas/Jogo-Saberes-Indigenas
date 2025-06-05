# 🎮 Jogo Saberes Indígenas UFR 🚀

Um jogo focado no aprendizado cultural das crianças indígenas do povo Bóe.

## ✨ Visão Geral do Projeto

Este projeto é um jogo educacional e divertido focado na interação de arrastar e soltar. O objetivo é proporcionar uma experiência lúdica para crianças, desenvolvendo a coordenação, raciocínio e aprendizado histórico cultural, escrita e linguística sobre o povo Bóe através de desafios visuais.

## 🛠️ Tecnologias Utilizadas

Este projeto é construído com as seguintes tecnologias principais:

* **React**
    * **O que é:** Uma biblioteca JavaScript declarativa, eficiente e flexível para a construção de interfaces de usuário (UIs). É a base do nosso aplicativo, permitindo a criação de componentes reutilizáveis em TSX.
    * **Instalação:** Já vem configurado ao criar o projeto com Vite.
    * **Para que serve no projeto:** Gerencia a estrutura do aplicativo, o estado dos componentes e a renderização da interface.

* **Vite**
    * **O que é:** Uma ferramenta de build (bundler) de próxima geração para desenvolvimento front-end. É conhecido por ser extremamente rápido no carregamento do servidor de desenvolvimento e na otimização de builds para produção.
    * **Instalação:** Usado para criar e gerenciar o ambiente de desenvolvimento do projeto.
    * **Para que serve no projeto:** Proporciona um ambiente de desenvolvimento ágil e performático, com recarregamento rápido do navegador (Hot Module Replacement - HMR) e um processo de build otimizado para o deploy final do jogo.

* **TypeScript**
    * **O que é:** Um superset do JavaScript que adiciona tipagem estática opcional ao código.
    * **Instalação:** Integrado na estrutura do projeto com Vite. Os arquivos de código fonte são `.ts` e `.tsx`.
    * **Para que serve no projeto:** Aumenta a robustez do código, facilita a manutenção, melhora o autocompletar do editor (IntelliSense) e ajuda a identificar erros em tempo de desenvolvimento, antes mesmo da execução.

* **Tailwind CSS**
    * **O que é:** Um framework CSS "utility-first" que permite criar designs customizados de forma rápida e eficiente, escrevendo classes diretamente no HTML/TSX.
    * **Instalação:** Integrado ao projeto. Suas dependências são listadas no `package.json` e instaladas com o comando `npm install` geral. Os arquivos de configuração (`tailwind.config.js`, `postcss.config.js`) e o CSS base (`src/index.css`) estão incluídos.
    * **Para que serve no projeto:** Utilizado para estilizar todos os componentes da interface do usuário, garantindo consistência visual e agilidade no desenvolvimento do design.

* **HTML5 Canvas API**
    * **O que é:** Uma API nativa do HTML5 que permite desenhar gráficos dinamicamente no navegador usando JavaScript (ou TypeScript, neste caso).
    * **Instalação:** Não requer instalação, é parte do navegador.
    * **Para que serve no projeto:** É a superfície onde todos os elementos gráficos do jogo (personagens, cenários, objetos arrastáveis) são desenhados, principalmente através do React Konva.

* **React Konva**
    * **O que é:** Um wrapper React para a biblioteca `Konva.js`. `Konva.js` é um framework JavaScript para desenho de gráficos 2D em HTML5 Canvas, otimizado para interatividade. O `React Konva` permite usar a sintaxe declarativa do React para criar e manipular elementos Konva.
    * **Instalação:** As dependências `react-konva` e `konva` estão listadas no `package.json` e são instaladas com `npm install`.
        ```bash
        # Para referência, caso precise reinstalar ou adicionar a um novo projeto:
        npm install react-konva konva
        ```
    * **Para que serve no projeto:** É a nossa principal ferramenta para a parte gráfica do jogo. Facilita a criação e manipulação de formas, imagens, textos, além de gerenciar eventos de mouse (como clicar e arrastar) diretamente no Canvas, de forma otimizada para o React.

* **Howler.js**
    * **O que é:** Uma biblioteca de áudio JavaScript leve e fácil de usar para a web. Oferece uma API simples e robusta para reproduzir, controlar e gerenciar sons.
    * **Instalação:** A dependência `howler` está listada no `package.json` e é instalada com `npm install`.
        ```bash
        # Para referência:
        npm install howler
        ```
    * **Para que serve no projeto:** Permite adicionar efeitos sonoros (sons de clique, arrastar, soltar, acerto, erro) e músicas de fundo ao jogo de forma eficiente e com boa compatibilidade entre navegadores, enriquecendo a experiência das crianças.

* **Framer Motion**
    * **O que é:** Uma biblioteca de animação de produção-pronta para React que torna a criação de animações de UI e interações super fácil, com sintaxe declarativa.
    * **Instalação:** A dependência `framer-motion` está listada no `package.json` e é instalada com `npm install`.
        ```bash
        # Para referência:
        npm install framer-motion
        ```
    * **Para que serve no projeto:** Se implementado, será usado para animar elementos da interface do usuário que *não* estão no Canvas (ex: placares de pontos, botões, pop-ups de "Parabéns!"), proporcionando transições e feedbacks visuais suaves e agradáveis.

---

## 🚀 Como Iniciar o Projeto (Setup Inicial)

Siga estas instruções para configurar o ambiente de desenvolvimento e rodar o projeto localmente.

### Pré-requisitos

Certifique-se de ter o [Node.js](https://nodejs.org/en/download/) (versão LTS recomendada) instalado em sua máquina. O Node.js inclui o npm (Node Package Manager), que será usado para instalar as dependências do projeto.

### Passos para Configuração

1.  **Clone o Repositório:**
    Abra seu terminal ou prompt de comando e clone o projeto do GitHub:

    ```bash
    git clone [https://github.com/victorino0071/Jogo-Saberes-Indigenas](https://github.com/victorino0071/Jogo-Saberes-Indigenas)
    ```

2.  **Navegue até a Pasta do Projeto:**
    Entre no diretório do projeto clonado:

    ```bash
    cd Jogo-Saberes-Indigenas
    ```

3.  **Instale as Dependências:**
    Instale todas as bibliotecas e pacotes necessários definidos no `package.json` (incluindo React, Vite, TypeScript, Tailwind CSS, Konva, etc.):

    ```bash
    npm install
    ```

4.  **Inicie o Servidor de Desenvolvimento:**
    Inicie o aplicativo em modo de desenvolvimento. Ele será aberto automaticamente no seu navegador padrão (geralmente em `http://localhost:5173/`).

    ```bash
    npm run dev
    ```

    Se o navegador não abrir automaticamente, você pode copiar e colar o endereço fornecido no terminal (ex: `http://localhost:5173/`) em seu navegador.

## 🤝 Como Contribuir

Ficamos felizes em receber contribuições! Para contribuir com o projeto, siga estes passos:

1.  Faça um `fork` do repositório.
2.  Crie uma nova `branch` para sua funcionalidade ou correção de bug (`git checkout -b minha-nova-feature`).
3.  Faça suas alterações e commit-as (`git commit -m 'feat: adicionei nova funcionalidade X'`).
4.  Envie suas alterações para o seu fork (`git push origin minha-nova-feature`).
5.  Abra um `Pull Request` para a branch `main` deste repositório, descrevendo suas alterações.

Por favor, certifique-se de que seu código siga as convenções do projeto e que todos os testes passem (se houver).

---