let aventura;

const lorem = `Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat mas`;
// const lorem = "";

main();

async function main() {
  const scenesPath = "./aventuraInteractiva.json";
  const scenes = await (await fetch(scenesPath)).json();

  // for (let k of Object.keys(scenes)) {
  //   scenes[k].image = "mapa";
  // }
  
  const options = {"typewriterSpeed":0,"adventureSlide":false,"adventureScroll":false,"evalTags":true,"backBtn":false,"restartBtn":false,"defaultCSS":true, defaultCSS: false, sceneCallback: sceneCallback(scenes)};

  aventura = new Aventura("es", options);
  const mapaImage = await createMap({});
  aventura.storyPreload.mapa = mapaImage;
  aventura.setScenes(scenes).startAdventure('Instrucciones');
  // aventura.setScenes(scenes).startAdventure('final');
}

async function createMap(register, type = "A") {
  const mapPath = `./mapas/mapa${type}.png`;
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

    const mapaImage = await createMap(register);
    aventura.storyPreload.mapa = mapaImage;
    
    if (e.key === "mapa") {
      console.log(register);

      let type = undefined;
      if (register["_6_pub_and_cont"] !== undefined) {
        type = "A";
      } else if (register["_6_cont_and_tec"] !== undefined) {
        type = "B"
      } else if (register["_6_cont_and_tec"] !== undefined) {
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
  // Split on explicit newlines to handle paragraphs
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
    // Draw any remaining text in this paragraph
    ctx.fillText(line, x, currentY);
    // After each paragraph, shift the starting y down by one extra line
    y = currentY + lineHeight;
  });
}

function findValue(register, key, type = "inputValue") {
  const valuesList = {
    contenidoText: ["cont_1", "pub_4_cont", "tec_4_cont", "_7_pub_and_tec_and_cont"],
    contextosText: ["contextos"],
    mediosText: ["tec_1", "cont_4_tec", "pub_4_tec", "_7_pub_and_cont_and_tec"],
    necesidadText: ["solucion_problema"],
    audienciasText: ["pub_1", "cont_4_pub", "tec_4_pub", "_7_cont_and_tec_and_pub"],
    fuentesText:["cont_2", "tec_5_cont_extra", "pub_5_cont_extra", "_8_pub_and_tec_and_cont_extra"],
    functionalidadesText:["tec_2", "cont_5_tec_extra", "pub_5_tec_extra", "_8_pub_and_cont_and_tec_extra"],
    incentivosText:["pub_2", "tec_5_pub_extra", "cont_5_pub_extra", "_8_cont_and_tec_and_pub_extra"],
    audiencias_contenidosText: ["_6_pub_and_cont"],
    usos_posiblesText: ["_6_cont_and_tec"],
    habilidades_experienciaText: ["_6_pub_and_tec"]
  }

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