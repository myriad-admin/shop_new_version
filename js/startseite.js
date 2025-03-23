document.addEventListener('DOMContentLoaded', init);
window.addEventListener('resize', init);

function init() {
    let teaserImageWrapper = document.getElementById('teaser-image-wrapper');
    let pictureDesktop = teaserImageWrapper.querySelector('source');
    let pictureMobile = teaserImageWrapper.querySelector('img');

    let breakpointWidth = pictureDesktop.getAttribute('media');
    let match = breakpointWidth.match(/(\d+)px/);

    let breakpoint;
    match ? breakpoint = parseInt(match[1], 10) : console.log('Kein Breakpoint gefunden')

    let screenWidth = window.innerWidth;

    let dots;
    let width;
    let height;

    if (screenWidth > breakpoint) {
        dots = document.querySelectorAll('.myd-teaser-picture .dots .desktop .dot');
        width = pictureDesktop.getAttribute("myd-width");
        height = pictureDesktop.getAttribute("myd-height");
        document.querySelector('.myd-teaser-picture .dots .mobile').classList.add('d-none');
        document.querySelector('.myd-teaser-picture .dots .desktop').classList.remove('d-none');
    } else {
        dots = document.querySelectorAll('.myd-teaser-picture .dots .mobile .dot');
        width = pictureMobile.getAttribute("myd-width");
        height = pictureMobile.getAttribute("myd-height");
        document.querySelector('.myd-teaser-picture .dots .mobile').classList.remove('d-none');
        document.querySelector('.myd-teaser-picture .dots .desktop').classList.add('d-none');
    }

    setDots(dots, width, height);
}


function setDots(dots, width, height) {
    let teaserPicture = document.getElementById('teaser-image');

    let teaserPictureOriginalWidth = width;
    let teaserPictureOriginalHeight = height;

    let relationshipInPercent = teaserPictureOriginalWidth / teaserPictureOriginalHeight;

    let teaserPictureVisibleHeight = teaserPicture.clientHeight;
    let teaserPictureVisibleWidth = teaserPicture.clientWidth;
    let teaserPictureWidth = teaserPicture.clientHeight * relationshipInPercent;
    let teaserPictureHeight = teaserPicture.clientWidth / relationshipInPercent;

    let widthRelationshipInPercent = teaserPictureOriginalWidth / teaserPictureWidth;
    let heightRelationshipInPercent = teaserPictureOriginalHeight / teaserPictureHeight;

    dots.forEach(dot => {
        let dotXPosition = dot.getAttribute("pos-x");
        let dotYPosition = dot.getAttribute("pos-y");

        if (dotXPosition === null || dotXPosition == "" || dotYPosition === null || dotYPosition == "") {
            console.warn("Dot position is missing for", dot);
            return;
        }

        if (teaserPictureVisibleWidth < (teaserPictureVisibleHeight * relationshipInPercent)) {
            //X-Koordinate setzen
            let dotFinalXPosition = dotXPosition / widthRelationshipInPercent - (teaserPictureWidth - teaserPictureVisibleWidth) / 2;
            dot.style.left = `${dotFinalXPosition}px`;

            //Y-Koordiante setzen
            let dotFinalYPosition = dotYPosition * 100 / teaserPictureOriginalHeight;
            dot.style.top = `${dotFinalYPosition}%`;

        } else {
            //X-Koordinate setzen
            let dotFinalXPosition = dotXPosition * 100 / teaserPictureOriginalWidth;
            dot.style.left = `${dotFinalXPosition}%`;

            //Y-Koordiante setzen
            let dotFinalYPosition = dotYPosition / heightRelationshipInPercent - (teaserPictureHeight - teaserPictureVisibleHeight) / 2
            dot.style.top = `${dotFinalYPosition}px`;
            console.log(teaserPictureHeight, teaserPictureVisibleHeight, dotFinalYPosition);
        }
    });
}