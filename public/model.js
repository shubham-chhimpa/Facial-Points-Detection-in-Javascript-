

async function loadModel() {
    let model = await tf.loadLayersModel('http://localhost:3000/model.json');
    return model;
}

function print(text) {
    console.log(text);
}


async function getGesture() {
    let model = await loadModel();
    model.summary();
    // console.log(model);

    //////////////////////////////
    // let allText = []
    // async function readTextFile(file) {
    //     var rawFile = new XMLHttpRequest();
    //     rawFile.open("GET", file, false);
    //     rawFile.onreadystatechange = function () {
    //         if (rawFile.readyState === 4) {
    //             if (rawFile.status === 200 || rawFile.status == 0) {
    //                 allText = rawFile.responseText;
    //                 allText = allText.split(",").map(Number);
    //                 return allText;
    //                 // console.log(allText[100]);
    //             }
    //         }
    //     }
    //     rawFile.send(null);
    // }

    // await readTextFile("http://localhost:3000/y.txt");
    ////////////////////////////////



    // var ctx = document.getElementById('canva').getContext('2d');

    // var img = new Image();
    // img.onload = function () {
    //     ctx.drawImage(img, 0, 0);
    //     const example = tf.browser.fromPixels(document.getElementById('canva'), 1).toFloat();  // for example

    //     // for (i = 5000; i < 8000; i++) {
    //     //     print(example.dataSync()[i]);

    //     // }
    //     console.log(example.reshape([1, 96, 96, 1]));
    //     let prediction = model.predict(example.reshape([1, 96, 96, 1]));
    //     prediction.print();
    //     print(prediction);
    //     function inverse_transform_y(min, max, y_trans) {
    //         x_min = [47.83575706, 23.83299623, 18.92261063, 24.7730717, 41.77938067, 27.19009811
    //             , 52.94714408, 26.25002264, 24.11262373, 26.25002264, 11.05458893, 26.52163265,
    //             35.58173342, 15.85936056, 55.54992895, 10.52232453, 25.0603266, 16.476
    //             , 3.82624306, 13.22445283, 24.47258951, 41.5584, 43.86947971, 57.02325806
    //             , 9.778137, 56.69020819, 32.26031197, 56.71904263, 33.04760474, 57.23229576];
    //         x_max = [78.01308179, 46.13242105, 42.49517173, 45.98098113, 69.0230303, 47.19031579,
    //             87.0322516, 49.65382488, 47.29374648, 44.88730097, 40.05097063, 50.00211321,
    //             67.752, 40.29340845, 94.26995745, 48.82342502, 51.30057143, 39.44585915,
    //             39.67608163, 44.85796226, 65.27965368, 75.99273134, 84.76712315, 94.67363736,
    //             50.97334818, 93.44317642, 61.80450618, 93.91633776, 62.43809524, 95.80898312];

    //         x_min = tf.tensor(x_min)
    //         x_max = tf.tensor(x_max)
    //         y_trans = y_trans.sub(min)
    //         y_trans = (y_trans).div(max - min)
    //         y_trans = y_trans.mul(x_max.sub(x_min))
    //         y_trans = y_trans.add(x_min)
    //         return y_trans
    //     }

    //     prediction = inverse_transform_y(-1, 1, prediction);
    //     prediction = prediction.reshape([15, 2]);

    //     function listToMatrix(list, elementsPerSubArray) {
    //         var matrix = [], i, k;

    //         for (i = 0, k = -1; i < list.length; i++) {
    //             if (i % elementsPerSubArray === 0) {
    //                 k++;
    //                 matrix[k] = [];
    //             }

    //             matrix[k].push(list[i]);
    //         }

    //         return matrix;
    //     }
    //     let imgData = ctx.getImageData(0, 0, 96, 96);
    //     let src = cv.matFromImageData(imgData);
    //     prediction.data().then(function (data) {
    //         data = listToMatrix(data, 2);
    //         // print(data)
    //         for (let i = 0; i < 15; i++) {

    //             c_point = new cv.Point(parseInt(data[i][0]), parseInt(data[i][1]));
    //             cv.circle(src, c_point, 1, [255, 0, 0, 255])

    //         }
    //         cv.imshow('canvasOutput', src);


    //     })

    //     // console.log(prediction)



    //     // for (i = 0; i < 30; i++) {
    //     //     print(prediction.dataSync()[i]);

    //     // }

    // };
    // img.src = 'http://localhost:3000/predict.png';


    ////////////////////////////////////////////////////////////////////////////////////


    let video = document.getElementById("videoInput"); // video is the id of video tag
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(function (stream) {
            video.srcObject = stream;
            video.play();
            setTimeout(processVideo, 1);



            const FPS = 14;
            async function processVideo() {
                let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
             
                let outsrc = new cv.Mat(video.height, video.width, cv.CV_8UC4);

                let cap = new cv.VideoCapture(video);
                let begin = Date.now();
                cap.read(src);
             outsrc = src.clone();
                //cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);

                // this is for face detection
                let gray = new cv.Mat();
                cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
                let faces = new cv.RectVector();
                let faceCascade = new cv.CascadeClassifier();
                // load pre-trained classifiers
                faceCascade.load('haarcascade_frontalface_default.xml');
                // detect faces
                let msize = new cv.Size(0, 0);
                faceCascade.detectMultiScale(gray, faces, 1.1, 3, 0, msize, msize);
                for (let i = 0; i < faces.size(); ++i) {
                    let roiGray = gray.roi(faces.get(i));
                    let roiSrc = src.roi(faces.get(i));
                    let point1 = new cv.Point(faces.get(i).x, faces.get(i).y);
                    let point2 = new cv.Point(faces.get(i).x + faces.get(i).width,
                        faces.get(i).y + faces.get(i).height);
                    cv.rectangle(src, point1, point2, [255, 0, 0, 255]);

                    // console.log(faces.get(i).x, faces.get(i).y, faces.get(i).width, faces.get(i).height);

                    let dst = new cv.Mat();
                    let dsize = new cv.Size(96, 96);
                    // print("xxxxxxxxxxxxxxxx")
                    // print(roiGray.cols)
                    // print(roiGray.rows)
                    // You can try more different parameters
                    cv.resize(roiGray, dst, dsize, 0, 0);
                    // cv.resize(roiSrc, src, dsize, 0, 0);
                    // print(dst.data);

                    let inpgrayImg = tf.tensor(dst.data);
                    let prediction = model.predict(inpgrayImg.reshape([1, 96, 96, 1]));
                    inpgrayImg  = null;
                    // prediction.print();

                    prediction = inverse_transform_y(-1, 1, prediction);
                    prediction = prediction.reshape([15, 2]);
                    p_data = await prediction.data();
                    p_data = listToMatrix(p_data, 2);
                    // print(p_data);

                    for (let j = 0; j < 15; j++) {

                        //  let c_point = new cv.Point((parseInt(p_data[j][0])*(400/96)), parseInt((p_data[j][1]))*(400/96));
                         let c_point = new cv.Point(parseInt(p_data[j][0] * ((roiGray.cols)/96))+faces.get(i).x, parseInt(p_data[j][1] * ((roiGray.cols)/96))+(faces.get(i).y));
                      
                        // print(c_point)

                        cv.circle(outsrc, c_point, 2, [255, 0, 0, 255],-1)
                        // cv.circle(src, c_point, 2, [255, 0, 0, 255])

                        // let nsize = new cv.Size(400, 400);

                        // cv.resize(src, src, nsize, 0, 0);

                        


                    }


                     drawGlasses(parseInt(p_data[13][0] * ((roiGray.cols)/96))+faces.get(i).x, parseInt(p_data[13][1] * ((roiGray.cols)/96))+(faces.get(i).y));

                    roiGray.delete(); roiSrc.delete();
                }
                cv.imshow('canvasOutput', src);
                cv.imshow('canva', outsrc);

               
                // face end here


                // cv.imshow("canvasOutput", dst);
                // schedule next one.
                outsrc.delete(); src.delete(); gray.delete(); faceCascade.delete();
                faces.delete();
                let delay = 1000 / FPS - (Date.now() - begin);
                setTimeout(processVideo, delay);



            }


        })
        .catch(function (err) {
            console.log("An error occurred! " + err);
        });



    // schedule first one.
    ///////////////////////////////////////////////////////////////////////////////////////////
}


function inverse_transform_y(min, max, y_trans) {
    x_min = [47.83575706, 23.83299623, 18.92261063, 24.7730717, 41.77938067, 27.19009811
        , 52.94714408, 26.25002264, 24.11262373, 26.25002264, 11.05458893, 26.52163265,
        35.58173342, 15.85936056, 55.54992895, 10.52232453, 25.0603266, 16.476
        , 3.82624306, 13.22445283, 24.47258951, 41.5584, 43.86947971, 57.02325806
        , 9.778137, 56.69020819, 32.26031197, 56.71904263, 33.04760474, 57.23229576];
    x_max = [78.01308179, 46.13242105, 42.49517173, 45.98098113, 69.0230303, 47.19031579,
        87.0322516, 49.65382488, 47.29374648, 44.88730097, 40.05097063, 50.00211321,
        67.752, 40.29340845, 94.26995745, 48.82342502, 51.30057143, 39.44585915,
        39.67608163, 44.85796226, 65.27965368, 75.99273134, 84.76712315, 94.67363736,
        50.97334818, 93.44317642, 61.80450618, 93.91633776, 62.43809524, 95.80898312];

    x_min = tf.tensor(x_min)
    x_max = tf.tensor(x_max)
    y_trans = y_trans.sub(min)
    y_trans = (y_trans).div(max - min)
    y_trans = y_trans.mul(x_max.sub(x_min))
    y_trans = y_trans.add(x_min)
    return y_trans
}



function listToMatrix(list, elementsPerSubArray) {
    var matrix = [], i, k;

    for (i = 0, k = -1; i < list.length; i++) {
        if (i % elementsPerSubArray === 0) {
            k++;
            matrix[k] = [];
        }

        matrix[k].push(list[i]);
    }

    return matrix;
}


function drawGlasses(x,y){
    var glasses = new Image();
    glasses.src = 'http://localhost:3000/mustache.png';

     glasses.onload = function () {
        let ctx = document.getElementById('canvasOutput').getContext('2d');
        overlay_scale = 0.07
        ctx.drawImage(glasses, parseInt(x - (glasses.width * overlay_scale)/2),parseInt(y- (glasses.height * overlay_scale)/2),glasses.width * overlay_scale , glasses.height * overlay_scale);
    }
}