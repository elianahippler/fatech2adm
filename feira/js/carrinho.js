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

function calcularEExibirTotalCarrinho() {
    let totalCarrinho = 0;
    allItems.forEach(item => {
        totalCarrinho += item.preco * item.quantidade;
    });
    const totalCarrinhoElement = document.getElementById('totalCarrinho');
    totalCarrinhoElement.textContent = `Total: R$ ${totalCarrinho.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    const totalPedidoElement = document.getElementById('totalPedido');
    totalPedidoElement.textContent = `TOTAL: R$ ${totalCarrinho.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    const totalPedidoCupomElement = document.getElementById('totalPedidoCupom');
    totalPedidoCupomElement.textContent = `TOTAL: R$ ${totalCarrinho.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
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

function atualizarQuantidadeProduto(key) {
    const item = allItems[key];
    const quantidadeElement = document.querySelector(`.quantidade-carrinho-${item.id}`);
    if (quantidadeElement) {
        quantidadeElement.textContent = item.quantidade;
    }
}

function atualizarCarrinho() {
    var containerCarrinho = document.getElementById('carrinho');
    containerCarrinho.innerHTML = "";
    allItems.forEach((val) => {
        if (val.quantidade > 0) {
            containerCarrinho.innerHTML += `
            <div class="info-single-checkout">
                <img src="${val.img}"/>
                <p class="nomeprodutocarrinho">${val.nome}</p>
                <button class="btnadd" onclick="adicionarAoCarrinho(${val.id})" id="botao-${val.id}">+</button>
                <p class="quantidade-no-carrinho">${val.quantidade}</p>
                <button class="btnrmv" onclick="removerDoCarrinho(${val.id})">-</button>
                <p class="precoprodutocarrinho">R$ ${val.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}(un)</p>
                <div style="clear:both;"></div>
            </div>`;
        }
    });

    var containerCarrinhoCupom = document.querySelector('.cupomcarrinho');
    containerCarrinhoCupom.innerHTML = `
        <div style="padding-bottom: 10px; border-top: 1px solid black; border-bottom: 1px solid black; height: 17px;">
        <p style="float:left;">PRODUTO</p>
        <p style="float:right;">QTDE</p>
        <p style="float:right; margin-right:15px;">VALOR UNIT.</p>
        </div>
        <br>`;
    allItems.forEach((val) => {
        if (val.quantidade > 0) {
            containerCarrinhoCupom.innerHTML += `
            <div class="info-single" style="padding-bottom: 7px;">
            <p class="nomeprodutocarrinhocupom" style="float:left;"> ${val.nome}</p>
            <p class="quantidade-no-carrinho-cupom" style="float:right;">${val.quantidade}</p>
            <p class="precoprodutocarrinhocupom" style="float:right; margin-right:50px;">R$ ${val.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            <div style="clear:both;"></div>`;
        }
    });
}

function redirecionarParaOPedido() {
    window.location.href = 'pedido.html';
}

function executarAcoesNovo() {
    limparCarrinho();
    redirecionarParaOPedido();
}

function executarAcoesConfirmar(){
    confirmarPedido();
    frameConfirmarPedido();
    criarPedido()
}

function confirmarPedido() {
    var section = document.querySelector('.mostrar');
    setTimeout(function() {
        section.style.opacity = '1';
        section.style.transform = 'translateX(0)';
    }, 10);
}

function frameConfirmarPedido() {
    var section2 = document.querySelector('.pedidoconfirmado');
    section2.style.display = 'block';
    setTimeout(function() {
        section2.style.opacity = '1';
    }, 10);
}

let numeroPedido = 1;

if (localStorage.getItem('ultimoNumeroPedido')) {
    numeroPedido = parseInt(localStorage.getItem('ultimoNumeroPedido')) + 1;
}

function gerarIdPedido() {
    const idPedido = `${numeroPedido}`;
    numeroPedido++;
    localStorage.setItem('ultimoNumeroPedido', numeroPedido - 1);
    return idPedido;
}

function criarPedido() {
    const idPedidoGerado = gerarIdPedido();
    const idPedidoElement = document.getElementById('idPedido');
    idPedidoElement.textContent = `${idPedidoGerado}`;
    const idPedidoCupomElement = document.getElementById('idPedidoCupom');
    idPedidoCupomElement.textContent = `PEDIDO N° ${idPedidoGerado}`;
    imprimirPedido()
    confirmarPedido()
}

const nomeArmazenado = localStorage.getItem('nome');

if (nomeArmazenado) {
    console.log('Nome Armazenado:', nomeArmazenado);
    const nomeClienteElement = document.getElementById('nomeCliente');
    nomeClienteElement.textContent = `Cliente: ${nomeArmazenado}`;
    const nomeClienteCupomElement = document.getElementById('nomeClienteCupom');
    nomeClienteCupomElement.textContent = `CLIENTE: ${nomeArmazenado}`;
}

function retornarTelaPrincipal(){
    window.location.href = 'index.html';
    limparCarrinho();
}

function imprimirPedido(){
    window.print();
}

function imprimir2via(){
    window.print();
}

const agora = new Date();

const dataFormatada = `${agora.getDate().toString().padStart(2, '0')}/${(agora.getMonth() + 1).toString().padStart(2, '0')}/${agora.getFullYear()}`;

const horaFormatada = `${agora.getHours().toString().padStart(2, '0')}:${agora.getMinutes().toString().padStart(2, '0')}:${agora.getSeconds().toString().padStart(2, '0')}`;

document.getElementById("dataPedido").textContent = `${dataFormatada}`;
document.getElementById("horaPedido").textContent = `${horaFormatada}`;

inicializarCarrinhoDoLocalStorage();
atualizarCarrinho();
calcularEExibirTotalCarrinho();
