class Remark {
    constructor (data, write, callback) {
      this.data = data;
      this.iswrite = write;
      this.callback = callback;

    }
    show () {
      $('.remark-menu').addClass('remark-active');
    }
    hide () {
      $('.remark-menu').removeClass('remark-active');
    }
    #close () {
      $('.fa-times').click( () => {
        this.hide();
      })
    }
    render () {

        let template =
        `<div class="remark-menu">
          <div class="head">
          <h2>Remarks</h2>
          <i class="fas fa-times"></i>
        </div>
        <div class="remark-holder" style="height : ${!this.iswrite ? 'calc(100% - 60px)' : ''}">
          <ul>`;

        // loop start
        this.data.map(x => {
          console.log(x)
          template += this.#addRemark(x);
        });
        // loop end
        template += `</ul></div>`;

        if(this.iswrite) {
        template += `
        <div class="options">
          <form action="">
            
                    <textarea name="" id=""  placeholder="Enter Remark"></textarea>
            <button >Add Remark &nbsp; <i class="fas fa-plus"></i></button>
          </form>
        </div>`;

        }

        template += `</div>`;
        $('main').append(template);
        this.#close();
        this.#write();

    }
    #write () {
      const remark = $('.remark-menu .options textarea');

      const button = $('.remark-menu .options button');

      button.click( e => {
        e.preventDefault();
        // alert()
        let date = new Date();
        let dd = String(date.getDate()).padStart(2, '0');
        let mm = String(date.getMonth() + 1).padStart(2, '0');
        let yyyy = date.getFullYear();
        date = dd + '-' + mm + '-' + yyyy;
        this.callback(remark.val(), date);
        $('.remark-holder ul').prepend(this.#addRemark({remark : remark.val(), date}));
        $('.remark-holder ul li').eq(0).css({background : '#d0ffd6'});
        remark.val('');
        setTimeout(function () {
          $('.remark-holder ul li').eq(0).css({background : '#eee', transition : '0.5s'});
        },500);

      })

    }
    #addRemark (x ) {

      const {date, remark} = x;
      return `<li>
      <div class="date"><i class="far fa-clock"></i><span>${date}</span></div>
      <div class="message">
      ${remark}
      </div>
     </li>`
    }

}
export default Remark;