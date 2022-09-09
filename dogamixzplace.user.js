// ==UserScript==
// @name         Dogami x zPlace
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  Petit calque pour créer le logo Dogami sur le Z Place
// @author       Bt0 Reivilow
// @match        https://place.zevent.fr/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL  https://github.com/Reivilo-w/dogami-x-zplace/raw/main/dogamixzplace.user.js
// @updateURL    https://github.com/Reivilo-w/dogami-x-zplace/raw/main/dogamixzplace.user.js
// ==/UserScript==

const colors = [
    { id: "0", rgb: "rgb(0, 0, 0)", hex: "#000000" },
    { id: "1", rgb: "rgb(51, 52, 52)", hex: "#333434" },
    { id: "2", rgb: "rgb(212, 215, 217)", hex: "#D4D7D9" },
    { id: "3", rgb: "rgb(255, 255, 255)", hex: "#FFFFFF" },
    { id: "4", rgb: "rgb(109, 48, 47)", hex: "#6D302F" },
    { id: "5", rgb: "rgb(156, 69, 26)", hex: "#9C451A" },
    { id: "6", rgb: "rgb(109, 0, 26)", hex: "#6D001A" },
    { id: "7", rgb: "rgb(190, 0, 39)", hex: "#BE0027" },
    { id: "8", rgb: "rgb(255, 38, 81)", hex: "#FF2651" },
    { id: "9", rgb: "rgb(255, 45, 0)", hex: "#FF2D00" },
    { id: "10", rgb: "rgb(255, 168, 0)", hex: "#FFA800" },
    { id: "11", rgb: "rgb(255, 180, 70)", hex: "#FFB446" },
    { id: "12", rgb: "rgb(255, 214, 35)", hex: "#FFD623" },
    { id: "13", rgb: "rgb(255, 248, 184)", hex: "#FFF8B8" },
    { id: "14", rgb: "rgb(126, 237, 56)", hex: "#7EED38" },
    { id: "15", rgb: "rgb(0, 204, 78)", hex: "#00CC4E" },
    { id: "16", rgb: "rgb(0, 163, 68)", hex: "#00A344" },
    { id: "17", rgb: "rgb(89, 141, 90)", hex: "#598D5A" },
    { id: "18", rgb: "rgb(0, 75, 111)", hex: "#004B6F" },
    { id: "19", rgb: "rgb(0, 158, 170)", hex: "#009EAA" },
    { id: "20", rgb: "rgb(0, 204, 192)", hex: "#00CCC0" },
    { id: "21", rgb: "rgb(51, 233, 244)", hex: "#33E9F4" },
    { id: "22", rgb: "rgb(94, 179, 255)", hex: "#5EB3FF" },
    { id: "23", rgb: "rgb(36, 90, 234)", hex: "#245AEA" },
    { id: "24", rgb: "rgb(49, 58, 193)", hex: "#313AC1" },
    { id: "25", rgb: "rgb(24, 50, 164)", hex: "#1832A4" },
    { id: "26", rgb: "rgb(81, 30, 159)", hex: "#511E9F" },
    { id: "27", rgb: "rgb(106, 92, 255)", hex: "#6A5CFF" },
    { id: "28", rgb: "rgb(51, 233, 244)", hex: "#33E9F4" },
    { id: "29", rgb: "rgb(180, 74, 192)", hex: "#B44AC0" },
    { id: "30", rgb: "rgb(255, 99, 170)", hex: "#FF63AA" },
    { id: "31", rgb: "rgb(228, 171, 255)", hex: "#E4ABFF" },
];

const logoUrl = "https://oliviso.dev/doga_logo.csv";

const doga = [];
const requiredColors = [];

const options = {
    OPACITY:  0.7,
    STARTX: 268,
    STARTY: 430,
    VERSION: GM_info.script.version,
};

function drawLogo() {
    const canvas = document.getElementById("place-canvas");
    if (canvas && canvas.getContext && options.OPACITY > 0) {
        const ctx = canvas.getContext("2d");

        for (let y = 0; y < doga.length; y++) {
            for (let x = 0; x < doga[y].length; x++) {
                const coordX = options.STARTX + x;
                const coordY = options.STARTY + y;

                const colorId = doga[y][x];

                ctx.fillStyle = colors[colorId].rgb
                    .replace("rgb", "rgba")
                    .replace(")", `,${options.OPACITY})`);
                ctx.fillRect(coordX, coordY, 1, 1);
                // console.log(`Pixel filled at ${coordX}, ${coordY} with ${ctx.fillStyle}`);
            }
        }
    }
}

function checkColor(x,y) {
    const colorRequired = requiredColors.filter(e => e.x == x && e.y == y);
    const btn = document.getElementById('headlessui-popover-button-:r3:');

    if(colorRequired.length > 0) {
        btn.style.borderColor = btn.style.backgroundColor === colorRequired[0].rgb ? 'green' : 'red';
    } else {
        btn.style.borderColor = 'transparent';
    }
}

function getRequiredColorForActualPos() {
    const [x,y] = getActualPos();
    return requiredColors.filter(e => e.x == x && e.y == y);
}

function getActualPos() {
    const pCoords = document.getElementsByClassName('confirm-dialog')[0].children[0].innerText;
    return pCoords.replace('x: ','').replace('y: ','').split(' - ');
}

(function() {
    'use strict';


    setTimeout(function(){
        drawLogo();
        const listenedElements = [document.getElementById("place-canvas"), document.getElementById("headlessui-popover-button-:r3:")];
        for(let k = 0; k < listenedElements.length; k++) {
            listenedElements[k].addEventListener('click',function() {
                setTimeout(function() {
                    const [cleanX,cleanY] = getActualPos();
                    checkColor(cleanX,cleanY);
                },300);
            });
        }

        document.getElementById("headlessui-popover-button-:r3:").addEventListener('click',function() {
            setTimeout(function(){
                const chooseElements = document.querySelectorAll('span[data-color]');
                const colorInfos = getRequiredColorForActualPos();
                if(colorInfos.length > 0 ) {
                    for(let ce = 0; ce < chooseElements.length; ce++) {
                        if(chooseElements[ce].style.backgroundColor == colorInfos[0].rgb) {
                            chooseElements[ce].style.transform = 'scale(1.3,1.3)';
                            chooseElements[ce].addEventListener('click', function() {
                                document.getElementById('headlessui-popover-button-:r3:').style.borderColor = 'green';
                            });
                        } else {
                            chooseElements[ce].style.transform = 'none';
                        }
                    }
                }
            },300);
        });

    },2000);

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                const csv_data = xhr.responseText;
                const csv_rows = csv_data.split(/\r?\n/);
                for (let rows of csv_rows) {
                    doga.push(rows.split(","));
                }
                for (let y = 0; y < doga.length; y++) {
                    for (let x = 0; x < doga[y].length; x++) {
                        const coordX = options.STARTX + x;
                        const coordY = options.STARTY + y;

                        const colorId = doga[y][x];

                        requiredColors.push({x:coordX, y:coordY, hex: colors[colorId].hex, rgb: colors[colorId].rgb});

                        /*const menu = document.createElement("div");
                        document.body.appendChild(menu);*/

                    }
                }

            } else {
                alert("Impossible de charger le calque");
            }
        }
    };
    xhr.open("GET", logoUrl);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
    xhr.send();
})();