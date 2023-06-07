const overlay = $("#overlay");
const btnUpload = $("#btn-upload");
const dropZoneElm = $("#drop-zone");
const mainElm = $("main");
const REST_API_URL = `http://localhost:8080/gallery`;
const cssLoaderHtml = '<div class="lds-facebook"><div></div><div></div><div></div></div>';
const btnDownload = $("#download")
const imgOverlay = $("#img-overlay");

btnUpload.on('click', () => overlay.removeClass('d-none'));
overlay.on('click', (eventData)=>{
    if (eventData.target === overlay[0]) overlay.addClass('d-none');
});
$(document).on('keyup', (eventData)=>{
    if (eventData.key === 'Escape' && !overlay.hasClass('d-none')) overlay.addClass('d-none');
});