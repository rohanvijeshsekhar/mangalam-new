class Button {
    constructor(button) {
        this.button = button;
        this.OrginalButton = this.button.cloneNode(true);
    }
    load (content) {
        $(this.button).empty().append(`<div class="loader-08"></div>${content}`);
    }
    stop () {
        $(this.button).empty().append(this.OrginalButton.innerHTML);
    }
}
export default Button;