class Toaster {
    constructor () {
        this.errorIcon = '<i class="fas fa-exclamation-triangle"></i>';
        this.successIcon = '<i class="fas fa-check"></i>';
        this.uploadIcon = '<i class="fas fa-upload"></i>';
        this.timeout = null;
        this.timer = 0;
    }
    #render () {
        let template =
        `<div class="toaster">
            <div class="content">
                <p></p>
            </div>
        </div>`;
        $('body').append(template);

    }
    trigger (prop) {
        const {type, content, timeout} = prop;
        this.timeout = timeout;
        let icon = null;
        switch(type) {
            case 'error':
                icon = this.errorIcon;
                break;
            case 'success':
                icon = this.successIcon;
                break;
            case 'upload':
                icon = this.uploadIcon;
                break;
        }
        $('.toaster').remove();
        this.#render();
        $('.toaster').css({
            background : type == 'success' ? '#a5e1ba' : type == 'error' ? '#ffbbbb' : type  == 'upload' ? '#f9c76b' : 'white'
        })
        $('.toaster .content').prepend(icon);

        $('.toaster .content p').empty().text(content);
        this.#show(type);
    }
    #show (type) {

        $('.toaster').addClass('toaster-active');
        if(type != 'upload') {
        this.timer = setTimeout(rest, this.timeout);
        }
        function rest() {
            $('.toaster').removeClass('toaster-active');
            $('.toaster .content i').remove();
            $('.toaster .content p').text('');
        };
    }
    kill () {
        $('.toaster').removeClass('toaster-active');
        $('.toaster .content i').remove();
        $('.toaster .content p').text('');
    }
}

export default Toaster;