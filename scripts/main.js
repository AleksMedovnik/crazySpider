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
        ]
    )
    .load(main);



function main() {

    const grass = new PIXI.Sprite(
        app.loader.resources['images/grass.jpg'].texture
    );
    const spider = createSpider(50, 50, 128, 128);
    const trap = createTrap(app.screen.width - 100, 100, 100, 100);

    const timer = {
        id: 30,
    }

    resize(grass, trap)

    app.stage.addChild(grass);
    app.stage.addChild(spider);
    app.stage.addChild(trap);


    app.ticker.add(() => {
        update(timer, spider, trap)
    });

    window.addEventListener('resize', () => resize(grass, trap));
    app.start();
}



// functions
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

function resize(texture, sprite) {
    texture.width = app.screen.width;
    texture.height = app.screen.height;
    sprite.x = app.screen.width - 70;
    sprite.y = 70;
}

function update(timer, sprite1, sprite2) {
    if (timer.id > 0) {
        timer.id--;
    } else {
        sprite1.x = 20 + (Math.random() * (app.screen.width - 40));
        sprite1.y = 20 + (Math.random() * (app.screen.height - 40));
        timer.id = 30;
    }

    if (hitTestRectangle(sprite1, sprite2)) {
        // 
    } else {
        //There's no collision
    }
}

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