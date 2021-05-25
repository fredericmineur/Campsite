function previewMultiple(event) {
    const images = document.querySelector("#images");
    const number = images.files.length;
    for (i = 0; i < number; i++) {
        const urls = URL.createObjectURL(event.target.files[i]);
        document.querySelector("#formFileImg").innerHTML += '<img src="' + urls + '">';
    }
}