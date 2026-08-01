class Header {
    constructor() {
        this.mounted = false;
    }

    render() {
        if (this.mounted || $('body > header').length) {
            this.mounted = true;
            return;
        }
        const template = `<header>
        <div class="title"></div> <div class="options">
            <div class="setting logout" style="display:flex;align-items:center;gap:10px;cursor:pointer;width:auto;padding:10px;background:rgba(207, 0, 0, 1);color:white; border-radius:5px;">
                <i class="fi fi-rr-sign-out-alt" style="color:white; font-size:14px; display:flex; justify-center; align-items-center"></i>
                <span style="color:white; font-size:16px;">Logout</span>
            </div>
        </div>
        </header>`;
        $('body').prepend(template);
        this.mounted = true;
    }

    update(title, icon) {
        const safeIcon = icon || '<i class="fi fi-rr-apps"></i>';
        $('header .title').empty().append(safeIcon + ' &nbsp; ' + title);
    }
}

export default Header;
