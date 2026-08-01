import Alert from "../alert/alert.js";
import Shimmer from "../shimmer/shimmer.js";
const shimmer = new Shimmer();
class Table {
    constructor (target) {
        this.target = target;
        this.currentRowId = null;
        this.icons = {
            edit : '<i class="fas fa-pen"></i>',
            view : '<i class="fas fa-eye"></i>',
            block : '<i class="fas fa-ban"></i>',
            delete: '<i class="fas fa-trash"></i>',
            remark: '<i class="fas fa-comment-alt"></i>'
        }
        this.freeze = null;
    }
    clear () {
        $(this.target).find('tbody').empty();
        $('.table-empty').remove();
    }
    addRow (content, id, freeze, color) {
        this.freeze = freeze;
        this.currentRowId = (Math.random() + 1).toString(36).substring(7);
        let row = 
        `<tr block-status="${this.freeze ? 'true' : 'false'}" style="background : ${color ? color : 'inherit'}" row-id="${id}" id=${this.currentRowId}>`;
            content.map( x => row   += `<td class="accept-block ${this.freeze ? 'block' : ''}">${x}</td>`);
        row +=
        `</tr>`;
        $(this.target).find('tbody').append(row);
    }
    actions (buttons) {
        let action =
        `<td class="actions">`;
            for(let key in buttons) {
                if(buttons.hasOwnProperty(key)) {
                    switch (key) {
                        case 'edit' :
                            action += `<a title="Edit" ${typeof(buttons[key]) == "string" ? 'href="'+buttons[key]+'"' : ''} class="edit-action table-action-button accept-block ${this.freeze ? 'block' : ''}" href="">${this.icons.edit}</a>`;
                            break;
                        case 'delete' :
                            // alert()
                            action += `<a title="Delete"  ${typeof(buttons[key]) == "string" ? 'href="'+buttons[key]+'"' : ''} class="delete-action table-action-button accept-block ${this.freeze ? 'block' : ''}" href="">${this.icons.delete}</a>`;
                            break;
                        case 'view' :
                            action += `<a title="View"  ${typeof(buttons[key]) == "string" ? 'href="'+buttons[key]+'"' : ''} class="view-action table-action-button accept-block ${this.freeze ? 'block' : ''}" href="">${this.icons.view}</a>`;
                            break;
                        case 'block' :
                            action += `<a title="Block"  ${typeof(buttons[key]) == "string" ? 'href="'+buttons[key]+'"' : 'p'} class="block-action table-action-button" href="">${this.icons.block}</a>`;
                            break;
                        case 'remark' :
                            action += `<a title="Show Remarks"  ${typeof(buttons[key]) == "string" ? 'href="'+buttons[key]+'"' : 'p'} class="remark-action table-action-button" href="">${this.icons.remark}</a>`;
                            break;
                    }
                }
            }
        action+=
        `</td>`;
        let currentRow = $('#' + this.currentRowId);
        currentRow.append(action);

        // delete listner
        let deletebutton = currentRow.find('.delete-action');
        deletebutton.click( e => {
            e.preventDefault();
            const alerts = new Alert({
                title : 'Are you sure about delete this ?',
                hint : 'you can\'t undo this action',
                cta : {
                    content : 'Delete',
                    color : '#ff4c4c',
                },
                icon : {
                    color : '#ff4c4c',
                    ico : '<i class="fas fa-trash"></i>'
                },
                callback :  buttons.delete,
                id : currentRow.attr('row-id'),
                action : () => {
                    this.#deleterow(currentRow);
                }
            });
            // this.#deleterow(currentRow, buttons.delete);
            alerts.show();
        })

        // block action
        let blockButton = currentRow.find('.block-action');
        blockButton.click( e => {
            e.preventDefault();
            const status = currentRow.attr('block-status');
            const alerts = new Alert({
                title : `Are you sure about ${status == 'false' ? 'block' : 'unblock'} this ?`,
                hint : 'you can undo this action',
                cta : {
                    content : status == 'false' ? 'block' : 'unblock',
                    color : 'orange',
                },
                icon : {
                    color : 'orange',
                    ico : '<i class="fas fa-ban"></i>'
                },
                callback :  buttons.block,
                id : currentRow.attr('row-id'),
                action : () => {

                    status == 'false' ? (currentRow.attr('block-status', 'true'), currentRow.find('.accept-block').addClass('block')) : (currentRow.attr('block-status', 'false'), currentRow.find('.accept-block').removeClass('block'));
                }
            });
            // this.#deleterow(currentRow, buttons.delete);
            alerts.show();
        });

        // block action
        let remarkButton = currentRow.find('.remark-action');
        remarkButton.click( e => {
            e.preventDefault();
            buttons.remark();
            
        });

    }
    #deleterow (row) {
        row.hide();
    }

    empty (prop) {
        const {button} = prop || {};
        let template =
        `<div class="table-empty">
            <div class="content">
                <div class="icon">
                    <img src="assets/icons/empty.png"/>
                </div>
                <h3 class>Hey, this table is empty !</h3>`;
                if(button) {
                    const {url, content} = button || {};
                    template +=`<a href="${url}">${content}</a>`;
                }

        template +=
            `</div>
        </div>`;
        this.clear();
        $(this.target).parent().append(template);
    }

    rowCount () {
        return $(this.target).find('tbody tr').length -1;
    }

    loader () {
        $("#progress").remove()
        let template = `<div id="progress" style="background : #ff7600!important; z-index : 1000000!important;"><b></b><i></i></div>`;
        $(this.target).parent().prepend(template);
        function progress() {
            $("#progress").width("100%").delay(600);
        }
        function stop () {
            $("#progress").remove()
        }
        return {
            progress,
            stop
        }
    }

}


export default Table;