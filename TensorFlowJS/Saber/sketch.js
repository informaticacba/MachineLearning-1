let trainImg = [];
let testImg = [];

let trainLabel;
let testLabel;
const trainImageTotal = 80;
const testImageTotal = 10;
const imagePixelSize = 16384;
let epoch = 10;

function preload(){
  for(let i = 0; i < trainImageTotal; i++){
    trainImg[i] = loadImage('trainingData/saber'+nf(i, 2)+'.png');
  }
  trainLabel = loadJSON("trainLabel.json");

  for(let i = 0; i < testImageTotal; i++){
    testImg[i] = loadImage('testData/saber'+nf(i, 2)+'.png');
  }
  testLabel = loadJSON("testLabel.json");
}

function trainDataCheck(index){
  let trainImageIndex = index; //must be 0 - 79
  image(trainImg[trainImageIndex], 0, 0);

  let coordXS = trainLabel.coordinates[trainImageIndex].xs;
  let coordYS = trainLabel.coordinates[trainImageIndex].ys;
  let coordXE = trainLabel.coordinates[trainImageIndex].xe;
  let coordYE = trainLabel.coordinates[trainImageIndex].ye;

  print(coordXS);
  print(coordYS);
  print(coordXE);
  print(coordYE);

  strokeWeight(4);
  stroke(255, 0, 0);
  line(coordXS, coordYS, coordXE, coordYE);
}

function testDataCheck(index){
  let testImageIndex = index; //must be 0 - 9
  image(testImg[testImageIndex], 0, 0);

  let coordXS = testLabel.coordinates[testImageIndex].xs;
  let coordYS = testLabel.coordinates[testImageIndex].ys;
  let coordXE = testLabel.coordinates[testImageIndex].xe;
  let coordYE = testLabel.coordinates[testImageIndex].ye;

  print(coordXS);
  print(coordYS);
  print(coordXE);
  print(coordYE);

  strokeWeight(4);
  stroke(255, 0, 0);
  line(coordXS, coordYS, coordXE, coordYE);
}


//display image then loading every pixels
function train(){
  shuffle(trainImg, true);
    for(let i = 0; i < trainImg.length; i++){
      image(trainImg[i], 0, 0);//Display the image
      let d = pixelDensity();
      let canvasImage = get();
      canvasImage.loadPixels();//Taking pixels on display

      //Make inputs
      let inputs = [];
      for(let i = 0; i < imagePixelSize; i++){
        let bright = canvasImage.pixels[i*4];//Only take braightness value
        inputs[i] = bright / 255; //Normalizing
      }
      print(inputs);
      //Taking labels from JSON
      let targets = [];
      let labelXS = trainLabel.coordinates[i].xs/128;
      let labelYS = trainLabel.coordinates[i].ys/128;
      let labelXE = trainLabel.coordinates[i].xe/128;
      let labelYE = trainLabel.coordinates[i].ye/128;
      targets.push(labelXS);
      targets.push(labelYS);
      targets.push(labelXE);
      targets.push(labelYE);

      nn.train(inputs, targets);
    }
}

function guess(){
  shuffle(testImg, true);
  // for(let i = 0; i < testImg.length; i++){
    image(testImg[0], 0, 0);//Display the image
    let d = pixelDensity();
    let canvasImage = get();
    canvasImage.loadPixels();//Taking pixels on display

    //Make inputs
    let inputs = [];
    for(let i = 0; i < imagePixelSize; i++){
      let bright = canvasImage.pixels[i];//Only take braightness value
      inputs[i] = bright / 255.0; //Normalizing
    }

    // for(let i = 0; i < imagePixelSize; i++){
    //   print(inputs[0]);
    // }

    //Taking labels from JSON
    let targets = [];
    let labelXS = testLabel.coordinates[0].xs/128;
    let labelYS = testLabel.coordinates[0].ys/128;
    let labelXE = testLabel.coordinates[0].xe/128;
    let labelYE = testLabel.coordinates[0].ye/128;
    targets.push(labelXS);
    targets.push(labelYS);
    targets.push(labelXE);
    targets.push(labelYE);

    let guess = nn.feedforward(inputs);
    print(guess);
  // }
}


function setup(){
  createCanvas(128, 128);
  background(255);

  nn = new NeuralNetwork(imagePixelSize, 128, 4);

  trainDataCheck(24);//Number must be 0 - 79
  testDataCheck(1);//Number must be 0 - 10

  let trainButton = select('#train');
  let epochCounter = 0;

  for(let epoch = 0; epoch < 2; epoch++){
    trainButton.mousePressed(function(){
      train();
      epochCounter++;
      console.log("Epoch: "+epochCounter);
    });
  }

  let testButton = select('#guess');
    testButton.mousePressed(function(){
  guess();
  });

}

function draw(){
}
