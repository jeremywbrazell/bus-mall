'use strict'


const pictureNames = ['bag', 'banana', 'bathroom', 'boots', 'breakfast', 'bubblegum', 'chair', 'cthulhu', 'dog-duck', 'dragon', 'pen', 'pet-sweep', 'scissors', 'shark', 'sweep', 'tauntaun', 'unicorn', 'usb', 'water-can', 'wine-glass'];
console.log(pictureNames);
const maxClicks = 26;
let totalClicks = 0;

// set these at the top for easy/safe use later in script.
const allImagesTag = document.getElementById('all-images')
const imageOneTag = document.getElementById('left-image')
const imageOneCaption = document.getElementById('left-image-caption')
const imageTwoTag = document.getElementById('center-image')
const imageTwoCaption = document.getElementById('center-image-caption')
const imageThreeTag = document.getElementById('right-image')
const imageThreeCaption = document.getElementById('right-image-caption')
const renderResults = document.getElementById('results')

//will be defined soon
let leftImageObject = null;
let centerImageObject = null;
let rightImageObject = null;

//constructor function (contructing a new object)
function Picture(caption, url) {
    this.caption = caption;
    this.url = url;
    this.clickCtr = 0;
    this.displayctr = 0;

    Picture.all.push(this);

    //declares empty array to be pushed to later
    // "Picture" is the constructor function and "all" is the array name
}
Picture.all = [];
console.log(Picture)
function createImagesFromScratch() {
    for (let i = 0; i < pictureNames.length; i++) {
        const imageName = pictureNames[i];
        new Picture(imageName, ' ./images/' + imageName + '.jpg');
    }
  
}

function createImagesFromStorage(storageGet) {
    const javaScriptPics = JSON.parse(storageGet);
    for (let i = 0; i < javaScriptPics.length; i++) {
        const rawData = javaScriptPics[i];
        const newPictureInst = new Picture(rawData.caption, rawData.url);
        newPictureInst.clickCtr = rawData.clickCtr;
        newPictureInst.displayctr = rawData.displayctr;
    }
}

function createPictureInstances() {
    const storageGet = localStorage.getItem('images');
    if (storageGet === null) {
        createImagesFromScratch();
    } else {
        createImagesFromScratch(storageGet);
    }
}

function pickNewPictures() {
    shuffle(Picture.all);
    const safeProducts = [];
    for (let i = 0; i < Picture.all.length; i++) {
        const candidatePicture = Picture.all[i];
        if (candidatePicture !== leftImageObject && candidatePicture !== centerImageObject && candidatePicture !== rightImageObject) {
            safeProducts.push(candidatePicture);
            if (safeProducts.length === 3) {
                break;
            }
        }
    }

    leftImageObject = safeProducts[0];
    centerImageObject = safeProducts[1];
    rightImageObject = safeProducts[2];
   

}

function renderNewImages() {
    imageOneTag.src = leftImageObject.url;
    imageOneTag.alt = leftImageObject.caption;
    imageOneCaption.textContent = leftImageObject.caption

    imageTwoTag.src = centerImageObject.url;
    imageTwoTag.alt = centerImageObject.caption;
    imageTwoCaption.textContent = centerImageObject.caption;

    imageThreeTag.src = rightImageObject.url;
    imageThreeTag.alt = rightImageObject.caption;
    imageThreeCaption.textContent = rightImageObject.caption;

}
//https://medium.com/@nitinpatel_20236/how-to-shuffle-correctly-shuffle-an-array-in-javascript-15ea3f84bfb

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i)
        const temp = array[i]
        array[i] = array[j]
        array[j] = temp
    }
}
function imageClickHandler(event) {

    const pictureId = event.target.id;
    console.log(event);
    leftImageObject.displayctr += 1;
    centerImageObject.displayctr += 1;
    rightImageObject.displayctr += 1;


    switch (pictureId) {

        case imageOneTag.id:
            leftImageObject.clickCtr += 1;
            pickNewPictures();
            renderNewImages();
            totalClicks += 1;
            break;

        case imageTwoTag.id:
            centerImageObject.clickCtr += 1;
            pickNewPictures();
            renderNewImages();
            totalClicks += 1;
            break;

        case imageThreeTag.id:
            rightImageObject.clickCtr += 1;
            pickNewPictures();
            renderNewImages();
            totalClicks += 1;
            break;

        default:
            alert('mind the gap!');
    }
console.log(totalClicks);
    if (totalClicks === maxClicks) {
        allImagesTag.removeEventListener('click', imageClickHandler);
        alert('PLEASE STOP CLICKING AND VIEW RESULTS!')
        const JSONPics = JSON.stringify(Picture.all)
        localStorage.setItem('pictures', JSONPics);

        const resultsButton = document.getElementById('results-button');
        resultsButton.addEventListener('click', renderList)
            
    }
}
function renderList() {
    const renderLikesElem = document.getElementById('results');
    renderLikesElem.innerHTML = '';
    for (let i = 0; i < Picture.all.length; i++) {
        const itemPicture = Picture.all[i];
        const itemPictureElem = document.createElement('li');
        renderLikesElem.appendChild(itemPictureElem);
        itemPictureElem.textContent = itemPicture.caption + ' : ' + itemPicture.clickCtr + ' clicks out of ' + itemPicture.displayctr + ' views';
        
    }
    renderChart();
}

function renderChart() {
    let viewsArray = []
    let tallyArray = []
    let productTitle = []
    for (let i = 0; i < Picture.all.length; i++) {
        const productViews = Picture.all[i].displayctr;
        const productTally = Picture.all[i].clickCtr;
        const productName = Picture.all[i].caption;
        tallyArray.push(productTally);
        viewsArray.push(productViews);
        productTitle.push(productName);
    }
    const ctx = document.getElementById('canvas').getContext('2d');
    const chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'horizontalBar',
        // The data for our dataset
        data: {
            labels: productTitle,
            datasets: [{
                label: 'Chosen Products',
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                // TODO: get the "good" product data in here
                data: tallyArray

            },
            {
            label: 'Items Viewed',
                backgroundColor: 'rgb(10, 200, 132)',
                // borderColor: 'rgb(255, 99, 132)',
                // TODO: get the "good" product data in here
                data: viewsArray
            }]
        },
        // Configuration options go here
        options: {}
    });
}

allImagesTag.addEventListener('click', imageClickHandler)

createPictureInstances();

pickNewPictures();


renderNewImages();


