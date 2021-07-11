const app = new PIXI.Application({ resizeTo: window });
document.body.appendChild(app.view);

app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth, window.innerHeight);

app.stop();

app.loader
    .add(
        [
            'images/grass.jpg',
            'images/spiders/spiders.json',
            'images/trap.png',
            'images/expl/explosion.json'
        ]
    )
    .load(main);



function main() {

    const grass = new PIXI.Sprite(
        app.loader.resources['images/grass.jpg'].texture
    );
    const spider = createSpider(50, 50, 128, 128);
    const trap = createTrap(app.screen.width - 100, 100, 100, 100);

    const control = {
        timer: 30,
        destroy: false,
        stop: false,
    }

    resize(grass, trap)

    app.stage.addChild(grass);
    app.stage.addChild(spider);
    app.stage.addChild(trap);


    app.ticker.add(() => {
        update(control, spider, trap)
    });

    window.addEventListener('resize', () => resize(grass, trap));
    app.start();
}


// update
function update(control, sprite1, sprite2) {
    if (control.timer > 0) {
        if (control.destroy) {
            sprite1.x = 0;
            sprite1.y = 0;
            sprite1.width = 0;
            sprite1.height = 0;

            sprite2.width = 0;
            sprite2.height = 0;

        }
        control.timer--;
    } else {
        sprite1.x = 20 + (Math.random() * (app.screen.width - 40));
        sprite1.y = 20 + (Math.random() * (app.screen.height - 40));
        control.timer = 30;
    }

    if (hitTestRectangle(sprite1, sprite2)) {
        control.destroy = true;
        const expl = createExplosion(sprite1.x, sprite1.y, 150, 150);
        app.stage.addChild(expl);
    }
}

// sprite-creators
function createTrap(x, y, w, h) {
    const trap = new PIXI.Sprite(
        app.loader.resources['images/trap.png'].texture
    );

    trap.interactive = true;
    trap.anchor.set(0.5);

    trap
        .on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove);

    trap.x = x;
    trap.y = y;
    trap.width = w;
    trap.height = h;

    return trap;
}
function createSpider(x, y, w, h) {

    const spiderTextures = [];
    for (let i = 0; i < 256; i++) {
        const texture = PIXI.Texture.from(
            `spider_${i}.png`
        );
        texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        spiderTextures.push(texture);
    }

    const spider = new PIXI.AnimatedSprite(spiderTextures);

    spider.x = x;
    spider.y = y;
    spider.width = w;
    spider.height = h;
    spider.anchor.set(0.5);
    spider.gotoAndPlay(0);
    spider.animationSpeed = .2;

    return spider;
}
function createExplosion(x, y, w, h) {

    const explTextures = [];
    for (let i = 0; i <= 6; i++) {
        const texture = PIXI.Texture.from(
            `expl_${i}.png`
        );
        texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        explTextures.push(texture);
    }

    const expl = new PIXI.AnimatedSprite(explTextures);

    expl.x = x;
    expl.y = y;
    expl.width = w;
    expl.height = h;
    expl.anchor.set(0.5);
    expl.gotoAndPlay(0);
    expl.animationSpeed = .2;
    expl.loop = false;

    return expl;
}

// handlers
function onDragStart(event) {
    this.data = event.data;
    this.dragging = true;
}
function onDragEnd() {
    this.dragging = false;
    this.data = null;
}
function onDragMove() {
    if (this.dragging) {
        const newPosition = this.data.getLocalPosition(this.parent);
        this.x = newPosition.x;
        this.y = newPosition.y;
    }
}

// resize
function resize(texture, sprite) {
    texture.width = app.screen.width;
    texture.height = app.screen.height;
    sprite.x = app.screen.width - 70;
    sprite.y = 70;
}

// collisions
function hitTestRectangle(r1, r2) {
    let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

    hit = false;

    r1.centerX = r1.x + r1.width / 2;
    r1.centerY = r1.y + r1.height / 2;
    r2.centerX = r2.x + r2.width / 2;
    r2.centerY = r2.y + r2.height / 2;

    // r1.halfWidth = r1.width / 2;
    // r1.halfHeight = r1.height / 2;
    r1.halfWidth = r1.width / 20;
    r1.halfHeight = r1.height / 20;
    r2.halfWidth = r2.width / 2;
    r2.halfHeight = r2.height / 2;

    vx = r1.centerX - r2.centerX;
    vy = r1.centerY - r2.centerY;
    combinedHalfWidths = r1.halfWidth + r2.halfWidth;
    combinedHalfHeights = r1.halfHeight + r2.halfHeight;
    if (Math.abs(vx) < combinedHalfWidths) {
        if (Math.abs(vy) < combinedHalfHeights) {
            hit = true;
        } else {
            hit = false;
        }
    } else {
        hit = false;
    }

    return hit;
};

