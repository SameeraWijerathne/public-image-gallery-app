// import {saveAs} from 'file-saver';

const overlay = $("#overlay");
const btnUpload = $("#btn-upload");
const dropZoneElm = $("#drop-zone");
const mainElm = $("main");
const REST_API_URL = `http://localhost:8080/gallery`;
const cssLoaderHtml = '<div class="lds-facebook"><div></div><div></div><div></div></div>';
const btnDownload = $("#download")
const imgOverlay = $("#img-overlay");

loadAllImages();
btnUpload.on('click', () => overlay.removeClass('d-none'));
overlay.on('click', (eventData)=>{
    if (eventData.target === overlay[0]) overlay.addClass('d-none');
});
$(document).on('keyup', (eventData)=>{
    if (eventData.key === 'Escape' && !overlay.hasClass('d-none')) overlay.addClass('d-none');
});

dropZoneElm.on('dragover', (evt)=> {
    evt.preventDefault();
});
dropZoneElm.on('drop', (evt)=> {
    evt.preventDefault();
    const droppedFiles = evt.originalEvent.dataTransfer.files;
    const imageFiles = Array.from(droppedFiles).filter(file => file.type.startsWith("image/"));
    if (!imageFiles.length) return;
    overlay.addClass('d-none');
    uploadImages(imageFiles);
});
overlay.on('dragover', (evt) => evt.preventDefault());
overlay.on('drop', (evt) => evt.preventDefault());
mainElm.on('click', '.image .download', (eventData) => {
    eventData.stopPropagation();

    const imgDiv = $(eventData.target).closest('.image');
    const imagePath = imgDiv.css('background-image').replace(/^url\(['"](.+)['"]\)/, '$1');
    const fileName = getFileName(imagePath);

    downloadImage(imagePath, fileName);
});
function getFileName(imagePath){
    return imagePath.substring(imagePath.lastIndexOf("/") + 1);
}
function downloadImage(imagePath, fileName) {
    let fileSaver = require('file-saver');
    fileSaver.saveAs(imagePath, fileName);
}

function loadAllImages(){
    const jqxhr = $.ajax(`${REST_API_URL}/images`);
    jqxhr.done((imageUrlList)=>{
        imageUrlList.forEach(imageUrl => {
            let imgDiv = $(`<div class="image">
                                <div id="download">
                                    <span class="download">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16" data-bs-toggle="tooltip" data-bs-title="Hooray!">
                                        <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                                        <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                                        </svg> 
                                    </span>
                                </div>
                                <div id="img-overlay"></div>
                            </div>`);
            imgDiv.css('background-image', `url('${imageUrl}')`);
            mainElm.append(imgDiv);
        });
    });
    jqxhr.fail(()=>{});
}

function uploadImages(imageFiles){
    const formData = new FormData();
    imageFiles.forEach(imageFile => {
        const divElm = $(`<div class="image loader"></div>`);
        divElm.append(cssLoaderHtml);
        mainElm.append(divElm);

        formData.append("images", imageFile);
    });
    const jqxhr = $.ajax(`${REST_API_URL}/images`, {
        method: 'POST',
        data: formData,
        contentType: false,
        processData: false
    });
    jqxhr.done((imageUrlList)=>{
        imageUrlList.forEach(imageUrl => {
            const divElm = $(".image.loader").first();
            divElm.css('background-image', `url('${imageUrl}')`);
            divElm.empty();
            divElm.removeClass('loader');
        });
    });
    jqxhr.always(() => $(".image.loader").remove());
}