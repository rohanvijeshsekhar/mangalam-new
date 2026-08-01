import Toaster from '../toaster/toaster.js';
let toaster = new Toaster();
class MultipleInput {
    constructor (input, label) {
        this.input = input;
        this.label = label;
        this.#setup();
        this.state = 0;
    }
    #setup () {
        let parent = $(this.input).closest('.input-holder');
        let group = parent.parent();
        let incrementButton = `<div class="increment-button"><i class="fas fa-plus"></i></div>`;
        parent.append(incrementButton);

        $('.increment-button').click( () => {
            if(this.state < 5) {
            group.append(`<div class="input-holder new-one">
            <label for="">${this.label}</label>
            <input required type="number" id="courseAmount" />
            <div class="close-input-button"><i class="fas fa-times"></i></div>
            </div>`);
            // $('.multiple-inputs')[0].scrollIntoView();
            this.state++;
            }else {
                toaster.trigger({
                    content : 'Cant add more than 6 Installments',
                    type : 'error',
                    timeout : 2000,
                })
            }
        });
        $('body').delegate('.close-input-button', 'click',  (e) => {
            $(e.target).closest('.input-holder').remove();
            this.state--;
        })

    }

}
export default MultipleInput;