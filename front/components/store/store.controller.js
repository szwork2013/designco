'use strict';

class StoreController {
    constructor() {
        let self = this;
        self.sayHi = 'hi from StoreController!';

        self.signs = [
            { title: 'Manager\s special' }
        ,   { title: 'fully sick' }
        ,   { title: 'yeeeeeaaaaarrrrrgh' }
        ];

        self.menuItems = [
            {
                title: 'signs'
            },
            {
                title: 'banners'
            },
            {
                title: 'vehicles'
            },
            {
                title: 'print'
            },
            {
                title: 'fabricated'
            },
            {
                title: 'traditional'
            }
        ];

        self.activeMenuItem = self.menuItems[1];

        self.thing = {
            sayHi: 'thingHi'
        }
    };



}

export { StoreController }
