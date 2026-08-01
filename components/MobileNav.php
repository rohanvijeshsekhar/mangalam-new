<?php function responsiveMenu($active)
{
?>
    <div class="responsive-float-header">
        <ul>
            <li>
                <a href="./" class="<?php echo $active == 'home' ? 'active' : '' ?>">
                    <i class="fi <?php echo $active == 'home' ? 'fi-sr-home' : 'fi-rr-home' ?>"></i>
                    Home
                </a>
            </li>
            <li>
                <a href="./holiday-package.php" class="<?php echo $active == 'holiday-package' ? 'active' : '' ?>">
                    <i class="fi <?php echo $active == 'holiday-package' ? 'fi-sr-marker' : 'fi-rr-marker' ?>"></i>
                    Packages
                </a>
            </li>
           
            <li class="mobile-customize-item">
                <a href="#" id="mobileCustomizeTrigger" class="mobile-customize-button" role="button" aria-expanded="false" aria-controls="mobileCustomizeDropdown">
                    <span class="mobile-customize-icon">
                        <svg width="84" height="85" viewBox="0 0 84 85" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g>
                                <circle cx="42" cy="38" r="28" fill="#1aacde" />
                                <rect x="27.3425" y="22.9854" width="13.9597" height="13.9597" rx="1.99424" stroke="white" stroke-width="0.965517" />
                                <rect x="27.8253" y="41.0174" width="12.9941" height="12.9941" rx="1.51148" stroke="white" stroke-width="0.965517" />
                                <rect x="44.9758" y="41.0174" width="12.9941" height="12.9941" rx="1.51148" stroke="white" stroke-width="0.965517" />
                                <rect x="44.9758" y="23.4681" width="12.9941" height="12.9941" rx="1.51148" stroke="white" stroke-width="0.965517" />
                            </g>
                        </svg>
                    </span>
                </a>
                <div id="mobileCustomizeDropdown" class="mobile-customize-dropdown" role="menu" aria-hidden="true">
                    <div class="mobile-customize-dropdown-header">Choose a Destination</div>
                    <div id="mobileCustomizeList" class="mobile-customize-dropdown-list">
                        <div class="mobile-customize-dropdown-empty">Loading...</div>
                    </div>
                </div>
            </li>

          
            <!-- <li>
                <a href="./tickets.php" class="<?php echo $active == 'ticket' ? 'active' : '' ?>">
                    <i class="fi <?php echo $active == 'ticket' ? 'fi-sr-ticket' : 'fi-rr-ticket' ?>"></i>
                    Tickets
                </a>
            </li> -->
            <li>
                <a href="./attraction.php" class="<?php echo $active == 'activity' ? 'active' : '' ?>">
                    <i class="fi <?php echo $active == 'activity' ? 'fi-sr-biking' : 'fi-rr-biking' ?>"></i>
                    Attractions
                </a>
            </li>
            <li>
                <a href="https://agents.mangalamtravel.com/Config/Login/Agent" target="_blank" class="<?php echo $active == 'agent' ? 'active' : '' ?>">
                    <i class="fi <?php echo $active == 'agent' ? 'fi-sr-user' : 'fi-rr-user' ?>"></i>
                    Agent Login
                </a>
            </li>

        </ul>
    </div>
<?php } ?>