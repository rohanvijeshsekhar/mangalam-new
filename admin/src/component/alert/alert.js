import Shimmer from "../shimmer/shimmer.js";
class Alert {
  constructor(prop) {
    const { title, hint, cta, icon, callback, id, action } = prop || {};
    this.title = title;
    this.hint = hint;
    this.ctaContent = cta.content;
    this.ctaColor = cta.color;
    this.icon = icon.ico;
    this.iconColor = icon.color;
    this.callback = callback;
    this.id = id;
    this.action = action;

    // Create element and store reference
    this.$el = $(this.#create());
    $('body').prepend(this.$el);
    this.#setup();
  }
  #create() {
    let template =
      `<div class="custom-alert fixed inset-0 z-[100] flex items-center justify-center p-4" style="display:none;">
        <div class="fixed inset-0 transition-opacity bg-black/50" aria-hidden="true"></div>
        
        <div class="relative bg-white rounded-lg shadow-2xl transform transition-all sm:max-w-md sm:w-full overflow-hidden">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="flex flex-col items-center justify-center text-center">
                    <div class="mx-auto flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-full mb-4" style="background-color: ${this.iconColor}20;">
                         <div style="color: ${this.iconColor}; font-size: 1.5rem;">
                             ${this.icon}
                         </div>
                    </div>
                    <div class="mt-3 w-full">
                        <h3 class="text-xl leading-6 font-bold text-gray-900">
                            ${this.title}
                        </h3>
                        <div class="mt-2">
                            <p class="text-sm text-gray-500">
                                ${this.hint}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 flex flex-row gap-3 justify-center">
                 <button type="button" class="alert-cancel w-1/2 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm transition-all duration-200">
                    Cancel
                </button>
                <button type="button" class="alert-confirm w-1/2 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm transition-all duration-200 hover:opacity-90" style="background-color: ${this.ctaColor};">
                    ${this.ctaContent}
                </button>
            </div>
        </div>
      </div>`;
    return template;
  }
  show() {
    this.$el.fadeIn(200);
  }
  hide() {
    this.$el.fadeOut(200, () => {
      this.$el.remove();
    });
  }
  #setup() {
    this.$el.find('.alert-cancel').click(() => {
      this.hide();
    });
    this.$el.find('.alert-confirm').click(() => {
      this.callback(this.id).then(() => {
        this.hide();
        this.action();
      }).catch(err => {
        console.error(err);
        this.hide();
      });
    });
  }
}
export default Alert;