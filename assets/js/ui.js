/*==================================================
LUNOVIA UI
Version 1.0
==================================================*/

"use strict";

/*==================================================
UI INITIALIZATION
==================================================*/

document.addEventListener(
    "DOMContentLoaded",
    initializeUI
);

function initializeUI(){

    initializeMegaMenu();

    initializeDropdowns();

    initializeTabs();

    initializeAccordions();

    initializeQuantityButtons();

    initializePasswordToggle();

    initializeCopyCoupons();

    initializeTooltips();

    initializeModals();

}
/*==================================================
MEGA MENU
==================================================*/

function initializeMegaMenu(){

    const items=document.querySelectorAll(
        ".has-mega-menu"
    );

    if(items.length===0){
        return;
    }

    items.forEach(function(item){

        item.addEventListener(
            "mouseenter",
            function(){

                closeAllMegaMenus();

                item.classList.add(
                    "mega-active"
                );

            }
        );

        item.addEventListener(
            "mouseleave",
            function(){

                item.classList.remove(
                    "mega-active"
                );

            }
        );

    });

}

function closeAllMegaMenus(){

    document
    .querySelectorAll(".has-mega-menu")
    .forEach(function(item){

        item.classList.remove(
            "mega-active"
        );

    });

}

/*==================================================
DROPDOWNS
==================================================*/

function initializeDropdowns(){

    const dropdowns=document.querySelectorAll(
        ".dropdown"
    );

    if(dropdowns.length===0){
        return;
    }

    dropdowns.forEach(function(dropdown){

        const button=
        dropdown.querySelector(
            ".dropdown-toggle"
        );

        if(!button){
            return;
        }

        button.addEventListener(
            "click",
            function(event){

                event.preventDefault();

                dropdown.classList.toggle(
                    "active"
                );

            }
        );

    });

    document.addEventListener(
        "click",
        function(event){

            dropdowns.forEach(function(dropdown){

                if(
                    !dropdown.contains(
                        event.target
                    )
                ){

                    dropdown.classList.remove(
                        "active"
                    );

                }

            });

        }
    );

}

/*==================================================
TABS
==================================================*/

function initializeTabs(){

    const groups=document.querySelectorAll(
        ".tabs"
    );

    if(groups.length===0){
        return;
    }

    groups.forEach(function(group){

        const buttons=
        group.querySelectorAll(
            ".tab-btn"
        );

        const panels=
        group.querySelectorAll(
            ".tab-panel"
        );

        buttons.forEach(function(button){

            button.addEventListener(
                "click",
                function(){

                    const target=
                    button.dataset.tab;

                    buttons.forEach(function(btn){

                        btn.classList.remove(
                            "active"
                        );

                    });

                    panels.forEach(function(panel){

                        panel.classList.remove(
                            "active"
                        );

                    });

                    button.classList.add(
                        "active"
                    );

                    const panel=
                    group.querySelector(
                        "#" + target
                    );

                    if(panel){

                        panel.classList.add(
                            "active"
                        );

                    }

                }
            );

        });

    });

    }
/*==================================================
ACCORDION
==================================================*/

function initializeAccordions(){

    const accordions=document.querySelectorAll(
        ".accordion"
    );

    if(accordions.length===0){
        return;
    }

    accordions.forEach(function(accordion){

        const items=
        accordion.querySelectorAll(
            ".accordion-item"
        );

        items.forEach(function(item){

            const button=
            item.querySelector(
                ".accordion-header"
            );

            if(!button){
                return;
            }

            button.addEventListener(
                "click",
                function(){

                    const opened=
                    item.classList.contains(
                        "active"
                    );

                    items.forEach(function(i){

                        i.classList.remove(
                            "active"
                        );

                    });

                    if(!opened){

                        item.classList.add(
                            "active"
                        );

                    }

                }
            );

        });

    });

}

/*==================================================
QUANTITY BUTTONS
==================================================*/

function initializeQuantityButtons(){

    const wrappers=document.querySelectorAll(
        ".quantity"
    );

    if(wrappers.length===0){
        return;
    }

    wrappers.forEach(function(wrapper){

        const input=
        wrapper.querySelector("input");

        const plus=
        wrapper.querySelector(".plus");

        const minus=
        wrapper.querySelector(".minus");

        if(plus){

            plus.addEventListener(
                "click",
                function(){

                    input.stepUp();

                    input.dispatchEvent(
                        new Event("change")
                    );

                }
            );

        }

        if(minus){

            minus.addEventListener(
                "click",
                function(){

                    input.stepDown();

                    input.dispatchEvent(
                        new Event("change")
                    );

                }
            );

        }

    });

}

/*==================================================
PASSWORD TOGGLE
==================================================*/

function initializePasswordToggle(){

    const buttons=document.querySelectorAll(
        ".password-toggle"
    );

    if(buttons.length===0){
        return;
    }

    buttons.forEach(function(button){

        button.addEventListener(
            "click",
            function(){

                const input=
                button.parentElement.querySelector(
                    "input"
                );

                if(!input){
                    return;
                }

                if(input.type==="password"){

                    input.type="text";

                    button.classList.add(
                        "active"
                    );

                }else{

                    input.type="password";

                    button.classList.remove(
                        "active"
                    );

                }

            }
        );

    });

}

/*==================================================
COPY COUPON
==================================================*/

function initializeCopyCoupons(){

    const buttons=document.querySelectorAll(
        "[data-copy]"
    );

    if(buttons.length===0){
        return;
    }

    buttons.forEach(function(button){

        button.addEventListener(
            "click",
            async function(){

                const value=
                button.dataset.copy;

                try{

                    await navigator.clipboard.writeText(
                        value
                    );

                    if(
                        typeof showToast==="function"
                    ){

                        showToast(
                            "Coupon copied",
                            "success"
                        );

                    }

                }catch(error){

                    console.error(error);

                }

            }
        );

    });

              }
/*==================================================
TOOLTIPS
==================================================*/

function initializeTooltips(){

    const tooltips=document.querySelectorAll(
        "[data-tooltip]"
    );

    if(tooltips.length===0){
        return;
    }

    tooltips.forEach(function(item){

        item.addEventListener(
            "mouseenter",
            function(){

                let tooltip=document.createElement(
                    "div"
                );

                tooltip.className="tooltip";

                tooltip.textContent=
                item.dataset.tooltip;

                document.body.appendChild(
                    tooltip
                );

                const rect=
                item.getBoundingClientRect();

                tooltip.style.left=
                rect.left+
                rect.width/2-
                tooltip.offsetWidth/2+
                window.scrollX+"px";

                tooltip.style.top=
                rect.top-
                tooltip.offsetHeight-
                10+
                window.scrollY+"px";

                requestAnimationFrame(function(){

                    tooltip.classList.add(
                        "show"
                    );

                });

                item._tooltip=tooltip;

            }
        );

        item.addEventListener(
            "mouseleave",
            function(){

                if(!item._tooltip){
                    return;
                }

                item._tooltip.remove();

                item._tooltip=null;

            }
        );

    });

}

/*==================================================
MODALS
==================================================*/

function initializeModals(){

    const buttons=document.querySelectorAll(
        "[data-modal]"
    );

    buttons.forEach(function(button){

        button.addEventListener(
            "click",
            function(event){

                event.preventDefault();

                const modal=document.querySelector(

                    button.dataset.modal

                );

                if(!modal){
                    return;
                }

                openModal(modal);

            }
        );

    });

    document.querySelectorAll(

        ".modal"

    ).forEach(function(modal){

        modal.addEventListener(

            "click",

            function(event){

                if(

                    event.target===modal ||

                    event.target.closest(

                        ".modal-close"

                    )

                ){

                    closeModal(modal);

                }

            }

        );

    });

}

function openModal(modal){

    modal.classList.add(
        "active"
    );

    document.body.classList.add(
        "modal-open"
    );

}

function closeModal(modal){

    modal.classList.remove(
        "active"
    );

    document.body.classList.remove(
        "modal-open"
    );

}

/*==================================================
DRAWERS
==================================================*/

function openDrawer(selector){

    const drawer=
    document.querySelector(selector);

    if(!drawer){
        return;
    }

    drawer.classList.add(
        "active"
    );

    document.body.classList.add(
        "drawer-open"
    );

}

function closeDrawer(selector){

    const drawer=
    document.querySelector(selector);

    if(!drawer){
        return;
    }

    drawer.classList.remove(
        "active"
    );

    document.body.classList.remove(
        "drawer-open"
    );

}

document.addEventListener(

    "click",

    function(event){

        const openButton=

        event.target.closest(

            "[data-open-drawer]"

        );

        if(openButton){

            event.preventDefault();

            openDrawer(

                openButton.dataset.openDrawer

            );

        }

        const closeButton=

        event.target.closest(

            "[data-close-drawer]"

        );

        if(closeButton){

            event.preventDefault();

            closeDrawer(

                closeButton.dataset.closeDrawer

            );

        }

    }

);
/*==================================================
RIPPLE EFFECT
==================================================*/

function initializeRipple(){

    const buttons=document.querySelectorAll(
        ".btn,.icon-btn,.action-btn"
    );

    if(buttons.length===0){
        return;
    }

    buttons.forEach(function(button){

        button.addEventListener(
            "click",
            function(event){

                const ripple=
                document.createElement(
                    "span"
                );

                ripple.className="ripple";

                const rect=
                button.getBoundingClientRect();

                const size=
                Math.max(
                    rect.width,
                    rect.height
                );

                ripple.style.width=size+"px";
                ripple.style.height=size+"px";

                ripple.style.left=
                event.clientX-
                rect.left-
                size/2+"px";

                ripple.style.top=
                event.clientY-
                rect.top-
                size/2+"px";

                button.appendChild(
                    ripple
                );

                setTimeout(function(){

                    ripple.remove();

                },600);

            }
        );

    });

}

/*==================================================
PROGRESS BAR
==================================================*/

function initializeProgressBars(){

    const bars=document.querySelectorAll(
        ".progress-bar"
    );

    if(bars.length===0){
        return;
    }

    const observer=
    new IntersectionObserver(

        function(entries){

            entries.forEach(function(entry){

                if(!entry.isIntersecting){
                    return;
                }

                const bar=
                entry.target;

                const value=
                bar.dataset.progress||0;

                bar.style.width=
                value+"%";

                observer.unobserve(bar);

            });

        },

        {
            threshold:0.3
        }

    );

    bars.forEach(function(bar){

        observer.observe(bar);

    });

}

/*==================================================
PAGE LOADER
==================================================*/

function showPageLoader(){

    const loader=
    document.querySelector(
        "#pageLoader"
    );

    if(loader){

        loader.classList.add(
            "active"
        );

    }

}

function hidePageLoader(){

    const loader=
    document.querySelector(
        "#pageLoader"
    );

    if(loader){

        loader.classList.remove(
            "active"
        );

    }

}

/*==================================================
SCROLL PROGRESS
==================================================*/

function initializeScrollProgress(){

    const progress=
    document.querySelector(
        "#scrollProgress"
    );

    if(!progress){
        return;
    }

    window.addEventListener(
        "scroll",
        function(){

            const height=

            document.documentElement
            .scrollHeight-

            window.innerHeight;

            const value=

            (window.scrollY/
            height)*100;

            progress.style.width=
            value+"%";

        }
    );

}

/*==================================================
GLOBAL EVENTS
==================================================*/

window.addEventListener(
    "load",
    function(){

        initializeRipple();

        initializeProgressBars();

        initializeScrollProgress();

    }
);

/*==================================================
HELPERS
==================================================*/

function addClass(element,name){

    if(element){

        element.classList.add(name);

    }

}

function removeClass(element,name){

    if(element){

        element.classList.remove(name);

    }

}

function toggleClass(element,name){

    if(element){

        element.classList.toggle(name);

    }

}

/*==================================================
END OF FILE
==================================================*/

console.log(
    "LUNOVIA UI Loaded Successfully"
);
