class Loader {
    constructor (target) {

        this.target = target;
        this.#render();
    }
    #render () {
        $('.page-loader').remove();
        let template = `<div class="page-loader" ${this.target ? 'style="position : absolute; left : 0; top : 0; width : 100%;"' : ''}><div class="loader-container"><div class="loader-11"></div></div></div>`;
        this.target ? ($(this.target).append(template), $(this.target).parent().css({position : 'relative'})) : $('body').append(template);
    }
    load () {
        return $('.page-loader').show();
    }
    stop () {
        return $('.page-loader').fadeOut();
    }
}

export default Loader;