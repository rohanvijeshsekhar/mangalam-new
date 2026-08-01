class ProgressBar {
    constructor() {

    }
    init() {
        let template =
            `<div class="progress-holder ">
            <div class="title">Be patient, Uploading...</div>
            <div class="progress">
                <div class="progress-bar" id="progressBar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
         </div>`;
        $('main').append(template);
    }
    progress(percentage) {
        $('#progressBar').css({ width: percentage + '%' }).html(percentage.toFixed(2) + '%');
        this.show();
        if (percentage == 100) {
            setTimeout(() => {
                this.hide();
                this.reset();
            }, 1000)
        }

    }
    show() {


        $('.progress-holder').addClass('active-progress')
    }
    hide() {
        $('.progress-holder').removeClass('active-progress');
    }
    reset() {
        $('#progressBar').css({ width: 0 + '%' }).html('');
    }
}

export default ProgressBar;