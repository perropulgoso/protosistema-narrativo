let aventura;
let valuesList;

main();

async function main() {
  const scenesPath = "./aventuraInteractiva.json";
  const scenes = await (await fetch(scenesPath)).json();
  const valuesPath = "./espaciosRespuestas.json";
  valuesList = await (await fetch(valuesPath)).json();

  // for (let k of Object.keys(scenes)) {
  //   scenes[k].image = "mapa";
  // }
  
  const options = {"typewriterSpeed":0,"adventureSlide":false,"adventureScroll":false,"evalTags":true,"backBtn":false,"restartBtn":false,"defaultCSS":true, defaultCSS: false, sceneCallback: sceneCallback(scenes)};

  aventura = new Aventura("es", options);
  // const mapaImage = await createMap({});
  // aventura.storyPreload.mapa = mapaImage;
  aventura.setScenes(scenes).startAdventure('Instrucciones');
  // aventura.setScenes(scenes).startAdventure('final');
}

async function createMap(register, type = "A") {
  const mapPath = `./mapas/mapa${type}.png`;
  console.log(mapPath);
  const img = new Image();
  img.src = mapPath;
  await new Promise(r => { img.onload = () => { r(img) }});

  const width = img.width;
  const height = img.height;

  const nx = 24;
  const ny = 12;
  const divx = width/nx;
  const divy = height/ny;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);

  ctx.font = '22px Arial';
  ctx.textAlign = "center";

  const widthEllipses = 420;
  const widthRects = 500;

  // Elipses
  const contenidoText = findValue(register, "contenidoText", "inputValue");
  drawWrappedText(ctx, contenidoText, divx*12.5, divy*2.5, widthEllipses, divy*0.3);

  const contextosText = findValue(register, "contextosText", "inputValue");
  drawWrappedText(ctx, contextosText, divx*12.5, divy*6.2, widthEllipses, divy*0.3);

  const mediosText = findValue(register, "mediosText", "inputValue");
  drawWrappedText(ctx, mediosText, divx*3.7, divy*7.8, widthEllipses, divy*0.3);

  const necesidadText = findValue(register, "necesidadText", "inputValue");
  drawWrappedText(ctx, necesidadText, divx*20.5, divy*1.2, widthEllipses, divy*0.3);

  const audienciasText = findValue(register, "audienciasText", "inputValue");
  drawWrappedText(ctx, audienciasText, divx*20.3, divy*7.8, widthEllipses, divy*0.3);

  // Recuadros
  const fuentesText = findValue(register, "fuentesText", "optionSelected");
  drawWrappedText(ctx, fuentesText, divx*12.5, divy*0.8, widthRects, divy*0.3);

  const functionalidadesText = findValue(register, "functionalidadesText", "inputValue");
  drawWrappedText(ctx, functionalidadesText, divx*3.7, divy*10.7, widthRects, divy*0.3);

  const incentivosText = findValue(register, "incentivosText", "inputValue");
  drawWrappedText(ctx, incentivosText, divx*20.2, divy*10.7, widthRects, divy*0.3);

  // Recuadros variables
  const audiencias_contenidosText = findValue(register, "audiencias_contenidosText", "inputValue");
  drawWrappedText(ctx, audiencias_contenidosText, divx*19.5, divy*5.2, widthRects, divy*0.3);

  const usos_posiblesText = findValue(register, "usos_posiblesText", "inputValue");
  drawWrappedText(ctx, usos_posiblesText, divx*4.7, divy*4.7, widthRects, divy*0.3);

  const habilidades_experienciaText = findValue(register, "habilidades_experienciaText", "inputValue");
  drawWrappedText(ctx, habilidades_experienciaText, divx*12.4, divy*9.6, widthRects, divy*0.3);

  const showGrid = false;

  if (showGrid) {
    ctx.strokeStyle = "red";
    for (let x = 0; x < nx; x++) {
      const xpos = (x * divx);
      ctx.beginPath();
      ctx.moveTo(xpos, 0);
      ctx.lineTo(xpos, height);
      ctx.stroke();
      ctx.fillText(x, xpos + ( divx / 2), 50);
    }

    for (let y = 0; y < ny; y++) {
      const ypos = (y * divy);
      ctx.beginPath();
      ctx.moveTo(0, ypos);
      ctx.lineTo(width, ypos);
      ctx.stroke();
      ctx.fillText(y, 50, ypos + ( divy / 2));
    }
  }

  const dataUrl = canvas.toDataURL('image/png');
  const newImg = new Image();
  newImg.src = dataUrl;
  await new Promise(r => { newImg.onload = () => { r(newImg) }});
  newImg.className = "storyimage";

  canvas.remove();
  return newImg;
}

function sceneCallback(scenes) {
  const register = {};
  let index = 0;

  const functionCallback = async (e, comesFromOption) => {

    if (this.prevScene === undefined) this.prevScene = [];
    const comesFromScene = this.prevScene[this.prevScene.length - 1];
    let optionSelected = undefined;
    if (comesFromScene !== undefined) {
      register[comesFromScene].optionSelected = comesFromOption;
    }
    this.prevScene.push(e.key);

    register[e.key] = { inputValue: undefined, comesFromOption, comesFromScene, optionSelected, index }
    const input = document.querySelector("#user-input-aventura");
    
    if (input) {
      input.setAttribute("maxlength", "280");
      input.addEventListener("input", (event) => {
        register[e.key].inputValue = event.target.value;
      });
    }

    // console.log(register);
    // const mapaImage = await createMap(register);
    // aventura.storyPreload.mapa = mapaImage;
    
    if (e.key === "final") {
      let type = undefined;
      if (register["_6_pub_and_cont"] !== undefined) {
        type = "A";
      } else if (register["_6_cont_and_tec"] !== undefined) {
        type = "B"
      } else if (register["_6_pub_and_tec"] !== undefined) {
        type = "C"
      }
      const mapaImage = await createMap(register, type);
      aventura.storyPreload.mapa = mapaImage;
      console.log(register, this.prevScene); // Prevscene es toda la ruta de escenas
    }

    index++;
  }

  return functionCallback
}

function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight) {
  const paragraphs = text.split('\n');

  paragraphs.forEach((para, pIndex) => {
    const words = para.split(' ');
    let line = '';
    let currentY = y + pIndex * lineHeight;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + (line ? ' ' : '') + words[n];
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        // Draw the current line and start a new one
        ctx.fillText(line, x, currentY);
        line = words[n];
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currentY);
    y = currentY + lineHeight;
  });
}

function findValue(register, key, type = "inputValue") {
  let value = "";
  for (let k of valuesList[key]) {
    if (register[k] !== undefined) {
      if (register[k][type] !== undefined) {
        value = register[k][type];
      }
    }
  }
  return value
}