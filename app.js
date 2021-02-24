'use strict'


const pictureNames = ['bag', 'banana', 'bathroom', 'boots', 'breakfast', 'bubblegum', 'chair', 'cthulhu', 'dog-duck', 'dragon', 'pen', 'pet-sweep', 'scissors', 'shark', 'sweep', 'tauntaun', 'unicorn', 'usb', 'water-can', 'wine-glass'];

const maxClicks = 6;
let totalClicks = 1;

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

function createPictures() {
    for (let i = 0; i < pictureNames.length; i++) {
        const pictureName = pictureNames[i];
        new Picture(pictureName, './images/' + pictureName + '.jpg');
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
    // console.log(leftImageObject);

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

    if (totalClicks === maxClicks) {
        allImagesTag.removeEventListener('click', imageClickHandler);
        document.getElementById('results');
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
        itemPictureElem.textContent = itemPicture.caption + ' : ' + itemPicture.clickCtr;
    }
    renderChart();
}

function renderChart() {
    let tallyArray = []
    for (let i = 0; i < Picture.all.length; i++) {
        const productTally = Picture.all[i].clickCtr;
        tallyArray.push(productTally);
    }
    const ctx = document.getElementById('canvas').getContext('2d');
    const chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'horizontalBar',
        // The data for our dataset
        data: {
            labels: pictureNames,
            datasets: [{
                label: 'Most Clicked',
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                // TODO: get the "good" product data in here
                data: tallyArray
            }]
        },
        // Configuration options go here
        options: {}
    });
}
allImagesTag.addEventListener('click', imageClickHandler)


createPictures();
pickNewPictures();
renderNewImages();






