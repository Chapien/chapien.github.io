var masonry;

imagesLoaded(document.querySelector('.grid'), function(instance) {
    masonry = new Masonry('.grid', {
        itemSelector: '.grid-item',
        columnWidth: '.grid-sizer',
        gutter: '.gutter-sizer',
        transitionDuration: 0,
        resize: true
    });
});

const element = document.getElementsByClassName('second-grid');
if (element.length > 0) {
    imagesLoaded(document.querySelector('.second-grid'), function(instance) {
        new Masonry('.second-grid', {
            itemSelector: '.grid-item',
            columnWidth: '.grid-sizer',
            gutter: '.gutter-sizer',
            transitionDuration: 0,
            resize: true
        });
    });
}

function relayout() {
    masonry.layout();
}
