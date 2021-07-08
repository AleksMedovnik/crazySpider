const app = new PIXI.Application({ resizeTo: window });
document.body.appendChild(app.view);

app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth, window.innerHeight);

app.stop();

app.loader
    .add(['images/grass.jpg',
        'images/spiders/spiders.json'])
    .load(onAssetsLoaded);

function onAssetsLoaded() {
    const spiderTextures = [];
    let timer = 30;

    let grass = new PIXI.Sprite(
        app.loader.resources['images/grass.jpg'].texture
    );

    grass.width = app.screen.width;
    grass.height = app.screen.height;

    app.stage.addChild(grass);



    for (let i = 0; i < 256; i++) {
        const texture = PIXI.Texture.from(
            `spider_${i}.png`
        );
        spiderTextures.push(texture);
    }

    const spider = new PIXI.AnimatedSprite(spiderTextures);

    spider.x = 50;
    spider.y = 50;
    spider.width = 128;
    spider.height = 128;
    spider.anchor.set(0.5);
    spider.gotoAndPlay(0);
    spider.animationSpeed = .3;

    app.stage.addChild(spider);

    app.ticker.add(() => {
        if (timer > 0) {
            timer--;
        } else {
            spider.x = Math.random() * (app.screen.width - 50);
            spider.y = Math.random() * (app.screen.height - 50);
            timer = 30;
        }
    });


    app.start();
}