// Jogo: AgroForte Futuro Sustentável
// Personagem se move com setas, coleta alimentos e árvores para equilibrar produção e meio ambiente

let player;
let alimentos = [];
let arvores = [];
let scoreProducao = 50;
let scoreAmbiente = 50;
let gameOver = false;

function setup() {
  createCanvas(900, 500);
  player = new Player();
}

function draw() {
  background(135, 206, 250); // céu azul

  if (!gameOver) {
    // chão
    fill(80, 180, 80);
    rect(0, height - 100, width, 100);

    // mostrar e atualizar jogador
    player.show();
    player.update();

    // criar alimentos aleatoriamente
    if (frameCount % 120 === 0) {
      alimentos.push(new Alimento());
    }

    // criar árvores aleatoriamente
    if (frameCount % 150 === 0) {
      arvores.push(new Arvore());
    }

    // atualizar alimentos
    for (let i = alimentos.length - 1; i >= 0; i--) {
      alimentos[i].show();
      alimentos[i].update();

      if (alimentos[i].hits(player)) {
        scoreProducao += 5;
        scoreAmbiente -= 2; // produção excessiva prejudica meio ambiente
        alimentos.splice(i, 1);
      } else if (alimentos[i].offscreen()) {
        alimentos.splice(i, 1);
      }
    }

    // atualizar árvores
    for (let i = arvores.length - 1; i >= 0; i--) {
      arvores[i].show();
      arvores[i].update();

      if (arvores[i].hits(player)) {
        scoreAmbiente += 5;
        scoreProducao -= 1; // reflorestar reduz produção temporariamente
        arvores.splice(i, 1);
      } else if (arvores[i].offscreen()) {
        arvores.splice(i, 1);
      }
    }

    // mostrar painel
    mostrarPainel();

    // verificar condições de fim de jogo
    verificarFim();
  } else {
    telaFinal();
  }
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    player.move(-1);
  } else if (keyCode === RIGHT_ARROW) {
    player.move(1);
  }

  if (key === 'R' || key === 'r') {
    reiniciar();
  }
}

// CLASSES

class Player {
  constructor() {
    this.x = width / 2;
    this.y = height - 120;
    this.size = 40;
    this.speed = 5;
  }

  show() {
    fill(34, 139, 34);
    rect(this.x, this.y, this.size, this.size);
  }

  update() {
    // manter dentro da tela
    this.x = constrain(this.x, 0, width - this.size);
  }

  move(dir) {
    this.x += dir * this.speed;
  }
}

class Alimento {
  constructor() {
    this.x = random(width);
    this.y = -20;
    this.size = 20;
    this.speed = 3;
  }

  show() {
    fill(255, 165, 0);
    ellipse(this.x, this.y, this.size);
  }

  update() {
    this.y += this.speed;
  }

  offscreen() {
    return this.y > height;
  }

  hits(player) {
    let d = dist(this.x, this.y, player.x + player.size / 2, player.y + player.size / 2);
    return d < (this.size / 2 + player.size / 2);
  }
}

class Arvore {
  constructor() {
    this.x = random(width);
    this.y = -20;
    this.size = 25;
    this.speed = 2;
  }

  show() {
    fill(34, 139, 34);
    rect(this.x, this.y, this.size / 2, this.size);
    fill(0, 100, 0);
    ellipse(this.x + this.size / 4, this.y, this.size, this.size / 2);
  }

  update() {
    this.y += this.speed;
  }

  offscreen() {
    return this.y > height;
  }

  hits(player) {
    let d = dist(this.x, this.y + this.size / 2, player.x + player.size / 2, player.y + player.size / 2);
    return d < (this.size / 2 + player.size / 2);
  }
}

// Funções auxiliares

function mostrarPainel() {
  fill(255);
  rect(10, 10, 250, 120, 10);

  fill(0);
  textSize(18);
  text("🌾 Produção: " + nf(scoreProducao, 1, 0), 135, 40);
  text("🌳 Meio Ambiente: " + nf(scoreAmbiente, 1, 0), 135, 70);
  text("⭐ Pontos: " + floor((scoreProducao + scoreAmbiente)/2), 135, 100);

  fill(0);
  textSize(16);
  text("Use ⬅️ ➡️ para se mover", width / 2, 30);
  text("Coletar alimentos aumenta produção", width / 2, 50);
  text("Coletar árvores aumenta meio ambiente", width / 2, 70);
}

function verificarFim() {
  if (scoreAmbiente <= 0) {
    gameOver = true;
    mensagem = "❌ O meio ambiente entrou em colapso!";
  }

  if (scoreProducao <= 0) {
    gameOver = true;
    mensagem = "❌ A produção agrícola acabou!";
  }

  if ((scoreProducao >= 100) && (scoreAmbiente >= 100)) {
    gameOver = true;
    mensagem = "🏆 AgroForte Sustentável alcançado!";
  }
}

let mensagem = "";

function telaFinal() {
  background(30, 80, 40);

  fill(255);
  textSize(36);
  text(mensagem, width / 2, height / 2 - 40);

  textSize(24);
  text("Pontuação Média: " + floor((scoreProducao + scoreAmbiente)/2), width / 2, height / 2 + 20);

  textSize(20);
  text("Pressione R para reiniciar", width / 2, height / 2 + 80);
}

function reiniciar() {
  scoreProducao = 50;
  scoreAmbiente = 50;
  player.x = width / 2;
  alimentos = [];
  arvores = [];
  gameOver = false;
  mensagem = "";
}