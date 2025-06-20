let estadoJogo = "inicio"; // inicio, jogando, fim
let peixes = [];
let balde = [];
let pontuacao = 0;
let tempoUltimoPeixe = 0;
let mensagem = "";
let tempoMensagem = 0;
let emojis = ['🐟', '🐠', '🐡','🎣','🦈','🐬','🐋','🐳'];
let tempoInicioJogo = 0;
const TEMPO_JOGO = 30000; // 30 segundos em milissegundos
const LIMITE_PEIXES = 10;

function setup() {
  createCanvas(800, 600);
  textAlign(CENTER, CENTER);
  textSize(32);
}

function draw() {
  background(135, 206, 235); // Céu azul

  // Desenha rio
  fill(30, 144, 255);
  noStroke();
  rect(0, height/2, width, height/2);
  
  // Desenha grama
  fill(34, 139, 34);
  rect(0, height/2 - 20, width, 40);
  
  if (estadoJogo === "inicio") {
    telaInicio();
  } else if (estadoJogo === "jogando") {
    jogar();
    verificarFimJogo();
  } else if (estadoJogo === "fim") {
    telaFim();
  }
  
  // Mostra mensagem temporária
  if (millis() - tempoMensagem < 2000 && mensagem !== "") {
    fill(0);
    textSize(24);
    text(mensagem, width/2, 100);
  }
  
  // Mostra informações do jogo
  fill(0);
  textSize(24);
  text(`Peixes: ${balde.length}/${LIMITE_PEIXES}`, width - 150, 30);
  text(`Tempo: ${max(0, ceil((TEMPO_JOGO - (millis() - tempoInicioJogo))/1000))}s`, width - 150, 60);
}

function telaInicio() {
  // Título
  fill(0);
  textSize(48);
  text("🎣 PESCARIA RELÂMPAGO 🐟", width/2, height/2 - 100);
  
  // Instruções
  textSize(20);
  text("Pesque 10 peixes OU em 30 segundos!", width/2, height/2 - 40);
  text("Clique nos peixes grandes (≥50px)", width/2, height/2 - 10);
  
  // Botão de início
  fill(255, 100, 100);
  rect(width/2 - 100, height/2 + 30, 200, 60, 10);
  fill(255);
  textSize(24);
  text("COMEÇAR", width/2, height/2 + 60);
}

function jogar() {
  // Gerar peixes novos
  if (millis() - tempoUltimoPeixe > 1000) { // Peixes aparecem mais rápido
    gerarPeixe();
    tempoUltimoPeixe = millis();
  }
  
  // Atualiza peixes
  for (let i = peixes.length - 1; i >= 0; i--) {
    peixes[i].update();
    peixes[i].display();
    
    // Verifica se clique do mouse acertou o peixe
    if (peixes[i].isClicked()) {
      verificarTamanhoPeixe(peixes[i]);
      peixes.splice(i, 1);
    }
  }
  
  // Desenha o balde com peixes
  desenharBalde();
}

function verificarFimJogo() {
  // Verifica condições de término
  if (balde.length >= LIMITE_PEIXES || millis() - tempoInicioJogo >= TEMPO_JOGO) {
    estadoJogo = "fim";
  }
}

function telaFim() {
  // Fundo semi-transparente
  fill(0, 0, 0, 150);
  rect(0, 0, width, height);
  
  // Mensagem de fim
  fill(255);
  textSize(36);
  text(balde.length >= LIMITE_PEIXES ? "🏆 VOCÊ VENCEU!" : "⏰ TEMPO ESGOTADO!", width/2, height/2 - 60);
  
  textSize(24);
  text(`Peixes pescados: ${balde.length}`, width/2, height/2 - 10);
  text(`Tempo restante: ${max(0, ceil((TEMPO_JOGO - (millis() - tempoInicioJogo))/1000))}s`, width/2, height/2 + 20);
  
  // Botão de reinício
  fill(100, 255, 100);
  rect(width/2 - 100, height/2 + 60, 200, 60, 10);
  fill(0);
  textSize(24);
  text("JOGAR NOVAMENTE", width/2, height/2 + 90);
}

function desenharBalde() {
  // Balde
  fill(150, 75, 0);
  rect(width - 120, height - 150, 100, 80);
  fill(50, 50, 50);
  rect(width - 130, height - 130, 10, 60);
  
  // Peixes no balde
  textSize(24);
  for (let i = 0; i < min(balde.length, 10); i++) {
    text(balde[i].emoji, width - 70, height - 120 + i * 20);
  }
}

function gerarPeixe() {
  let tamanho = floor(random(30, 80));
  let y = random(height/2 + 50, height - 50);
  let velocidade = random(1, 4);
  let emojiAleatorio = random(emojis);
  peixes.push(new Peixe(-50, y, tamanho, velocidade, emojiAleatorio));
}

function verificarTamanhoPeixe(peixe) {
  if (peixe.tamanho < 50) {
    mensagem = `❌ PEIXE PEQUENO (${peixe.tamanho}px) FORA DE MEDIDA!`;
    tempoMensagem = millis();
  } else {
    balde.push(peixe);
    mensagem = `✅ ${peixe.emoji} BOM PEIXE! ${peixe.tamanho}px`;
    tempoMensagem = millis();
  }
}

function mousePressed() {
  if (estadoJogo === "inicio" && 
      mouseX > width/2 - 100 && 
      mouseX < width/2 + 100 && 
      mouseY > height/2 + 30 && 
      mouseY < height/2 + 90) {
    estadoJogo = "jogando";
    tempoInicioJogo = millis();
  } else if (estadoJogo === "fim" && 
             mouseX > width/2 - 100 && 
             mouseX < width/2 + 100 && 
             mouseY > height/2 + 60 && 
             mouseY < height/2 + 120) {
    reiniciarJogo();
  }
}

function reiniciarJogo() {
  estadoJogo = "jogando";
  peixes = [];
  balde = [];
  pontuacao = 0;
  tempoUltimoPeixe = 0;
  tempoInicioJogo = millis();
}

class Peixe {
  constructor(x, y, tamanho, velocidade, emoji) {
    this.x = x;
    this.y = y;
    this.tamanho = tamanho;
    this.velocidade = velocidade;
    this.emoji = emoji;
  }
  
  update() {
    this.x += this.velocidade;
    
    // Remove peixes que saíram da tela
    if (this.x > width + this.tamanho) {
      let index = peixes.indexOf(this);
      if (index !== -1) {
        peixes.splice(index, 1);
      }
    }
  }
  
  display() {
    textSize(map(this.tamanho, 30, 80, 24, 48));
    text(this.emoji, this.x, this.y);
  }
  
  isClicked() {
    let d = dist(mouseX, mouseY, this.x, this.y);
    return d < this.tamanho/2 && mouseIsPressed;
  }
}
