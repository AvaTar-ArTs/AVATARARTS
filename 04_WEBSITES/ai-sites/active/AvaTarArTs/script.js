function openLightbox(imageSrc) {
    document.getElementById('lightbox').style.display = 'flex';
    document.getElementById('lightbox-img').src = imageSrc;
}

function closeLightbox() {
    document.getElementById('lightbox').style.display = 'none';
    document.getElementById('lightbox-img').src = '';
}
