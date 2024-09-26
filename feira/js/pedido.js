const agua = [
    {id: 0, nome: 'Água com gás', img: '../feira/imagens/produtos/0.jpeg', preco: 3.00, quantidade: 0},
    {id: 1, nome: 'Água sem gás', img: '../feira/imagens/produtos/1.jpeg', preco: 3.00, quantidade: 0},
    {id: 2, nome: 'Suco 500ml', img: '../feira/imagens/produtos/9.jpg', preco: 10.00, quantidade: 0},
    {id: 3, nome: 'Suco 330ml', img: '../feira/imagens/produtos/10.jpg', preco: 7.00, quantidade: 0},
];

const trufas = [
    {id: 4, nome: 'Trufa de Brigadeiro', img: '../feira/imagens/produtos/2.jpg', preco: 4.00, quantidade: 0},
    {id: 5, nome: 'Trufa de Paçoca', img: '../feira/imagens/produtos/3.jpg', preco: 4.00, quantidade: 0},
    {id: 6, nome: 'Trufa de Maracujá', img: '../feira/imagens/produtos/4.jpg', preco: 4.00, quantidade: 0},
];

const paodemel = [
    {id: 7, nome: 'Pão de Mel - Brigadeiro', img: '../feira/imagens/produtos/5.jpg', preco: 10.00, quantidade: 0},
    {id: 8, nome: 'Pão de Mel - Maracujá', img: '../feira/imagens/produtos/6.jpg', preco: 10.00, quantidade: 0},
    {id: 9, nome: 'Pão de Mel - Doce Leite', img: '../feira/imagens/produtos/7.jpg', preco: 10.00, quantidade: 0},  
];

const brownie = [
    {id: 10, nome: 'Brownie', img: '../feira/imagens/produtos/8.jpg', preco: 10.00, quantidade: 0},
];

const allItems = agua.concat(trufas, paodemel, brownie);

document.getElementById("cliente").addEventListener("submit", function (event) {
    event.preventDefault();
    alert('Clique no botão para Visualizar seu pedido!')
});

function calcularEExibirTotalCarrinho() {
    let totalCarrinho = 0;
    allItems.forEach(item => {
        totalCarrinho += item.preco * item.quantidade;
    });

    const visualizarPedidoButton = document.getElementById('visualizarPedidoButton');
    visualizarPedidoButton.textContent = `(R$ ${totalCarrinho.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}) Visualizar Pedido 🡢`;
}

function adicionarAoCarrinho(key) {
    const item = allItems[key];
    item.quantidade++;
    atualizarCarrinho();
    atualizarQuantidadeProduto(key);
    calcularEExibirTotalCarrinho();
    salvarCarrinhoNoLocalStorage();
    return false;
}

calcularEExibirTotalCarrinho();

function removerDoCarrinho(key) {
    const item = allItems[key];
    if (item.quantidade > 0) {
        item.quantidade--;
        atualizarCarrinho();
        atualizarQuantidadeProduto(key);
        calcularEExibirTotalCarrinho();
        salvarCarrinhoNoLocalStorage();
    } return false;
}

function limparCarrinho() {
    allItems.forEach(item => {
        item.quantidade = 0;
        atualizarQuantidadeProduto(item.id);
    });
    atualizarCarrinho();
    calcularEExibirTotalCarrinho();
    salvarCarrinhoNoLocalStorage();
}

function inicializarCarrinhoDoLocalStorage() {
    const carrinhoDoLocalStorage = JSON.parse(localStorage.getItem('carrinho'));
    if (carrinhoDoLocalStorage) {
        allItems.forEach((item, index) => { 
            item.quantidade = carrinhoDoLocalStorage[index].quantidade;
        });

        allItems.forEach((item, index) => {
            atualizarQuantidadeProduto(index);
        });
    }
}

function salvarCarrinhoNoLocalStorage() {
    const carrinhoParaSalvar = allItems.map(item => {
        return { quantidade: item.quantidade };
    });
    localStorage.setItem('carrinho', JSON.stringify(carrinhoParaSalvar));
}

function inicializarLoja(categoria, containerId) {
    const containerProdutos = document.getElementById(containerId);
    categoria.forEach((val) => {
        containerProdutos.innerHTML += `
        <div class="produto-single" id="${val.id}">
            <img src="${val.img}"/>
            <p class="nomeproduto">${val.nome}</p>
            <p class="precoproduto">R$ ${val.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            <button class="btnadd" onclick="adicionarAoCarrinho(${val.id})" id="botao-${val.id}">+</button>
            <p class="quantidade-no-carrinho"><span class="quantidade-carrinho-${val.id}">${val.quantidade}</span></p>
            <button class="btnrmv" onclick="removerDoCarrinho(${val.id})" id="botao-remover-${val.id}">-</button>
        </div>`;
    });
}

function atualizarQuantidadeProduto(key) {
    const item = allItems[key];
    const produtoElement = document.getElementById(item.id);
    if (produtoElement) {
        const quantidadeElement = produtoElement.querySelector(`.quantidade-carrinho-${item.id}`);
        if (quantidadeElement) {
            quantidadeElement.textContent = item.quantidade;
            if (item.quantidade > 0) {
                produtoElement.classList.add('selecionado');
            } else {
                produtoElement.classList.remove('selecionado');
            }
        }
    }
}

function atualizarCarrinho() {
    var containerCarrinho = document.getElementById('carrinho');
    containerCarrinho.innerHTML = "";
    allItems.forEach((val) => {
        if (val.quantidade > 0) {
            containerCarrinho.innerHTML += `
            <div class="info-single-checkout">
                <p style="float:left;">Produto: ${val.nome}</p>
                <p style="float:right; margin-left: 15px;"> Quantidade: ${val.quantidade}</p>
                <p style="float:right;">Valor unitário: R$ ${val.preco.toFixed(2)}</p>
                <button onclick="removerDoCarrinho(${val.id})">Remover</button>
                <div style="clear:both;"></div>
            </div>`;
        }
    });
}

function validarPedido() {
    const produtosSelecionados = allItems.some(item => item.quantidade > 0);
    if (produtosSelecionados == "") {
        alert('Nenhum produto foi selecionado. Selecione pelo menos um produto antes de continuar.');
        return false
    } return true
}

function validarNome() {
    var nomeInput = document.getElementById("nome");
    if (nomeInput.value === "") {
        alert("Por favor, preencha seu nome antes de continuar.");
        nomeInput.focus();
        return false;
    } return true;
}

function redirecionarParaCarrinho() {
    if (validarPedido() && validarNome()) {
    window.location.href = 'carrinho.html';
    }
}

const campoNome = document.getElementById('nome');
const visualizarPedidoButton = document.getElementById('visualizarPedidoButton');

visualizarPedidoButton.addEventListener('click', function () {
    const nome = campoNome.value;
    const nomeCompleto = nome;
    console.log('Nome Completo:', nomeCompleto);
    localStorage.setItem('nome', nome);
});

inicializarLoja(agua, 'produtosAgua');
inicializarLoja(trufas, 'produtosTrufas');
inicializarLoja(paodemel, 'produtosPao');
inicializarLoja(brownie, 'produtosBrownie');
inicializarCarrinhoDoLocalStorage();
atualizarCarrinho();
calcularEExibirTotalCarrinho();