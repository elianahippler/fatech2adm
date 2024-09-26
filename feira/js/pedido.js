const lanches = [
    {id: 0, nome: 'Cachorro-quente', img: '../feira/imagens/produtos/01.jpg', preco: 10.00, quantidade: 0},
    {id: 1, nome: 'Espetinho', img: '../feira/imagens/produtos/02.jpg', preco: 8.50, quantidade: 0},
    {id: 2, nome: 'Pão-de-Queijo + Café', img: '../feira/imagens/produtos/03.jpg', preco: 3.00, quantidade: 0},
];

const cookies = [
    {id: 3, nome: 'Cookie Tradicional', img: '../feira/imagens/produtos/04.jpg', preco: 5.00, quantidade: 0},
    {id: 4, nome: 'Cookie com Nuttela', img: '../feira/imagens/produtos/05.jpg', preco: 6.00, quantidade: 0},
];

const doces = [
    {id: 5, nome: 'Pudim', img: '../feira/imagens/produtos/06.jpg', preco: 4.00, quantidade: 0},
    {id: 6, nome: 'Sonho Doce', img: '../feira/imagens/produtos/07.jpg', preco: 11.00, quantidade: 0},
];

const combos = [
    {id: 7, nome: 'Combo Família:<h3> 5 Espetinhos</h3>', img: '../feira/imagens/produtos/08.jpg', preco: 40.00, quantidade: 0},
    {id: 8, nome: 'Espudim:<h3> 2 Espetinhos e 2 Pudins</h3>', img: '../feira/imagens/produtos/09.jpg', preco: 20.00, quantidade: 0},
    {id: 9, nome: 'Duplo Sabor:<h3> 2 Cachorro-Quente + 2 Cookies c/Brigadeiro</h3>', img: '../feira/imagens/produtos/10.jpg', preco: 40.00, quantidade: 0},
    {id: 10, nome: 'Explosão de Sabores:<h3> 4 Espetinhos + 2 Cookies c/Nutella</h3>', img: '../feira/imagens/produtos/11.jpg', preco: 42.00, quantidade: 0},
    {id: 11, nome: 'Combo Quádruplo:<h3> 4 Cachorro-Quente</h3>', img: '../feira/imagens/produtos/12.jpg', preco: 35.00, quantidade: 0},
];

const allItems = lanches.concat(cookies, doces, combos);

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

inicializarLoja(lanches, 'produtosLanches');
inicializarLoja(cookies, 'produtosCookies');
inicializarLoja(doces, 'produtosDoces');
inicializarLoja(combos, 'produtosCombos');
inicializarCarrinhoDoLocalStorage();
atualizarCarrinho();
calcularEExibirTotalCarrinho();