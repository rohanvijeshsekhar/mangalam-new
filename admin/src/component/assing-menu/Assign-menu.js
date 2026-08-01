class Assignmenu {
    constructor(data) {
        this.data = data;
        this.parent = $('main');
        this.menu = '';
        this.init = false;
    }
    kill() {
        $('.assign-menu').remove();
    }
    #create() {
        this.menu =
            `<div class="assign-menu">
                <h2>Assing Lead to Staff</h2>
                <div class="assign-container">
                    <form action="">
                        <ul>`;
        this.data.map(x => {
            const {
                id,
                name
            } = x;
            if (x != undefined)
                this.menu += ` <li><input type="radio" value="${id}" data-name="${name}" name="assign-input" id=""><span>${name}</span></li>`;
        });
        this.menu += `
                        </ul>
                    </form>
                        </div>
                        <div class="footer">
                            <button  class="cancel">
                                Cancel
                            </button>
                            <button disabled class="assign">
                                Assign
                            </button>
                        </div>
                    </div>`;
        if (this.menu != "")
            return this.menu;
    }
    render(callback) {
        this.kill();
        this.parent.append(this.#create());
        this.init = true;
        this.#event(callback);
    }
    #event(callback) {

        const radios = $('.assign-menu').find('input');
        const Assignbutton = $('.assign-menu').find('.assign');
        const cancelButton = $('.assign-menu').find('.cancel');

        radios.click(function () {
            if ($(this).is(':checked')) {
                Assignbutton.removeAttr('disabled');
                Assignbutton.css({
                    opacity: 1
                })
            }
        });

        Assignbutton.click(() => {
            callback({
                name: $('.assign-menu input:checked')[0].getAttribute('data-name'),
                id: $('.assign-menu input:checked')[0].value,
            });
        })

        cancelButton.click(() => {
            this.hide();
            // do stuff
        })

    }

    show() {
        return $('.assign-menu').addClass('assign-menu-active');
    }
    hide() {
        return $('.assign-menu').removeClass('assign-menu-active');
    }

}
export default Assignmenu;