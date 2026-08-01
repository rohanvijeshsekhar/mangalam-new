class Sidemenu {

    constructor() {
        this.mounted = false;
    }

    render() {
        if (this.mounted) {
            return;
        }
        let template = `
            <nav class="sidemenu">
                <div class="header">          
                   <img src="../assets/images/logo-color.png" alt="Mangalam" class="admin-logo">
                   <div class="toggle-btn"><i class="fi fi-rr-angle-double-left"></i></div>
                </div>
                <div class="navigation custom-scroll menu-holder">
                    <div class="menu-label">General</div>
                    <ul>
                        <li><a link-ref="dashboard" href="dashboard.html"><i class="fi fi-rr-apps"></i> <span>Dashboard</span></a></li>
                    </ul>

                    <div class="menu-label">Management</div>
                    <ul>
                        <li><a link-ref="enquiry" href="list-enquiry.html"><i class="fi fi-rr-envelope"></i> <span>Enquiry</span> <span class="badge"></span></a></li>
                        <li><a link-ref="destination" href="list-destinations.html"><i class="fi fi-rr-plane-alt"></i> <span>Destinations</span></a></li>
                        <li><a link-ref="place" href="list-place.html"><i class="fi fi-rr-marker"></i> <span>Places</span></a></li>
                        <li><a link-ref="package" href="list-package.html"><i class="fi fi-rr-backpack"></i> <span>Packages</span></a></li>
                        <li><a link-ref="ticket" href="list-tickets.html"><i class="fi fi-rr-ticket"></i> <span>Tickets</span></a></li>
                        <li><a link-ref="activity" href="list-activities.html"><i class="fi fi-rr-running"></i> <span>Activities</span></a></li>
                    </ul>

                    <div class="menu-label">Content</div>
                    <ul>
                        <li><a link-ref="collection" href="list-collection.html"><i class="fi fi-rr-folder"></i> <span>Collections</span></a></li>
                        <li><a link-ref="blog" href="list-blog.html"><i class="fi fi-rr-document"></i> <span>Blogs</span></a></li>
                        <li><a link-ref="testimonial" href="list-testimonials.html"><i class="fi fi-rr-comment-alt"></i> <span>Testimonials</span></a></li>
                        <li><a link-ref="partners" href="list-partners.html"><i class="fi fi-rr-users-alt"></i> <span>Partners</span></a></li>
                        <li><a link-ref="poster" href="list-posters.html"><i class="fi fi-rr-picture"></i> <span>Posters</span></a></li>
                        <li><a link-ref="marketing" href="marketing.html"><i class="fi fi-rr-megaphone"></i> <span>Marketing</span></a></li>
                        <li><a link-ref="notice" href="list-notice.html"><i class="fi fi-rr-bell"></i> <span>Notices</span></a></li>
                    </ul>

                    <div class="menu-label">Settings</div>
                    <ul>
                        <li><a link-ref="change-password" href="change-password.html"><i class="fi fi-rr-lock"></i> <span>Change Password</span></a></li>
                    </ul>
                </div>
                
                <div class="sidemenu-footer">
                    <div class="user-profile">
                        <div class="user-icon"><i class="fi fi-rr-user"></i></div>
                        <div class="user-info">
                            <span class="name">Admin</span>
                            <span class="role">Manager</span>
                        </div>
                        <i class="fi fi-rr-angle-small-right chevron"></i>
                    </div>
                </div>
            </nav>`;
        $('body').prepend(template);
        this.#setup();
        this.mounted = true;
    }

    #setup() {
        if (!$('link[href*="uicons-regular-rounded"]').length) {
            $('head').append('<link rel="stylesheet" href="https://cdn-uicons.flaticon.com/uicons-regular-rounded/css/uicons-regular-rounded.css">');
        }

        // Visual active state only — do not preventDefault or Barba navigation breaks
        const links = $('.navigation ul li a');
        links.off('click.sidemenuActive').on('click.sidemenuActive', function () {
            links.removeClass('active');
            $(this).addClass('active');
        });
    }

    active(para) {
        const links = $('.navigation ul li a');
        links.removeClass('active');
        links.each(function () {
            if ($(this).attr('link-ref') == para) {
                $(this).addClass('active');
            }
        });
    }

    hint(para) {
        const { target, content } = para;
        let template = `<div class="hint">${content}</div>`;
        const links = $('.navigation ul li a');
        links.each(function () {
            const link = $(this).attr('link-ref');
            if (target == link) {
                $(this).append(template);
            }
        })
    }

    current() {
        const active = $('.navigation ul li a.active');
        if (active.length) {
            return active;
        }
        // Fallback so header.update never crashes during Barba transitions
        return $('.navigation ul li a').first();
    }

    iconHtml() {
        const icon = this.current().find('i').get(0);
        return icon ? icon.outerHTML : '<i class="fi fi-rr-apps"></i>';
    }
}
export default Sidemenu;
