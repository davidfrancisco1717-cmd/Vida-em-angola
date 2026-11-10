import Phaser from "phaser";
import "./style.css";

class BairroScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Container;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys!: Record<string, Phaser.Input.Keyboard.Key>;
  private target: Phaser.Math.Vector2 | null = null;
  private statusText!: Phaser.GameObjects.Text;

  constructor() { super("bairro"); }

  create() {
    const w = this.scale.width, h = this.scale.height;
    this.cameras.main.setBackgroundColor("#b9d8c0");

    // Fundo e ruas
    const g = this.add.graphics();
    g.fillStyle(0x8fbd91, 1); g.fillRect(0, 0, w, h);
    g.fillStyle(0xd8c7a5, 1);
    g.fillPoints([{x:w*.05,y:h*.43},{x:w*.95,y:h*.28},{x:w*.95,y:h*.48},{x:w*.05,y:h*.64}], true);
    g.fillPoints([{x:w*.42,y:h*.08},{x:w*.58,y:h*.08},{x:w*.75,y:h*.95},{x:w*.58,y:h*.95}], true);
    g.lineStyle(3, 0xf5e9ca, .9);
    g.lineBetween(w*.05,h*.53,w*.95,h*.38);
    g.lineBetween(w*.5,h*.08,w*.66,h*.95);

    // Casas em perspectiva simples
    this.drawHouse(w*.18,h*.28,0xd96e4f);
    this.drawHouse(w*.72,h*.2,0xe4b45f);
    this.drawHouse(w*.12,h*.72,0x77a7b9);
    this.drawHouse(w*.82,h*.67,0xd58c68);
    this.drawHouse(w*.48,h*.78,0xe5d6a8);

    // Árvores e praça
    this.add.circle(w*.36,h*.27,22,0x397c4e);
    this.add.circle(w*.36,h*.25,15,0x559b5d);
    this.add.circle(w*.88,h*.45,25,0x397c4e);
    this.add.circle(w*.88,h*.43,17,0x559b5d);
    this.add.ellipse(w*.52,h*.48,90,42,0xb5a27d).setStrokeStyle(2,0xeee0bd);
    this.add.text(w*.52,h*.48,"PRAÇA",{fontFamily:"Arial",fontSize:"12px",color:"#493d2b",fontStyle:"bold"}).setOrigin(.5);

    this.add.text(18, 16, "BAIRRO DO SOL",{fontFamily:"Arial",fontSize:"13px",color:"#244b34",fontStyle:"bold",backgroundColor:"#ffffffaa",padding:{x:8,y:5}});
    this.statusText = this.add.text(18,h-28,"Explora o bairro",{fontFamily:"Arial",fontSize:"12px",color:"#244b34",backgroundColor:"#ffffffbb",padding:{x:8,y:5}});

    this.player = this.add.container(w*.5,h*.58);
    const shadow = this.add.ellipse(0,14,25,10,0x23412c,.25);
    const body = this.add.ellipse(0,0,18,25,0x2367b1);
    const head = this.add.circle(0,-16,9,0x8d573b);
    const hair = this.add.arc(0,-20,9,180,360,false,0x25201c).setStrokeStyle(5,0x25201c);
    const label = this.add.text(0,25,"Tu",{fontFamily:"Arial",fontSize:"11px",color:"#17334a",fontStyle:"bold"}).setOrigin(.5);
    this.player.add([shadow,body,head,hair,label]);
    this.player.setDepth(10);

    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.keys = this.input.keyboard.addKeys("W,A,S,D") as Record<string, Phaser.Input.Keyboard.Key>;
    }
    this.input.on("pointerdown", (p: Phaser.Input.Pointer) => {
      this.target = new Phaser.Math.Vector2(p.x,p.y);
      this.statusText.setText("A caminhar...");
    });
    this.scale.on("resize", () => this.scene.restart());
  }

  private drawHouse(x:number,y:number,color:number) {
    const g=this.add.graphics();
    g.fillStyle(0x000000,.15); g.fillEllipse(x+8,y+34,90,18);
    g.fillStyle(color,1); g.fillPoints([{x:x-35,y:y},{x:x+28,y:y+12},{x:x+28,y:y+55},{x:x-35,y:y+42}],true);
    g.fillStyle(0x9b493b,1); g.fillPoints([{x:x-43,y:y-8},{x:x-4,y:y-29},{x:x+37,y:y-12},{x:x-3,y:y+8}],true);
    g.fillStyle(0x68432f,1); g.fillRect(x-8,y+22,15,32);
    g.fillStyle(0xbce0e4,1); g.fillRect(x-29,y+14,12,12);
  }

  update(_:number, delta:number) {
    const speed = 0.18 * delta;
    let dx=0,dy=0;
    if (this.cursors?.left.isDown || this.keys?.A.isDown) dx--;
    if (this.cursors?.right.isDown || this.keys?.D.isDown) dx++;
    if (this.cursors?.up.isDown || this.keys?.W.isDown) dy--;
    if (this.cursors?.down.isDown || this.keys?.S.isDown) dy++;
    if (dx || dy) {
      this.target=null;
      const len=Math.hypot(dx,dy)||1;
      this.player.x += dx/len*speed;
      this.player.y += dy/len*speed*.75;
    } else if (this.target) {
      const vx=this.target.x-this.player.x, vy=this.target.y-this.player.y;
      const dist=Math.hypot(vx,vy);
      if(dist<5){this.target=null;this.statusText.setText("Chegaste ao destino!");}
      else {this.player.x+=vx/dist*speed;this.player.y+=vy/dist*speed;}
    }
    this.player.x=Phaser.Math.Clamp(this.player.x,20,this.scale.width-20);
    this.player.y=Phaser.Math.Clamp(this.player.y,55,this.scale.height-20);
  }
}

new Phaser.Game({
  type: Phaser.AUTO, parent: "game", width: 900, height: 560,
  backgroundColor: "#b9d8c0",
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH, width: 900, height: 560 },
  physics: { default: "arcade" },
  scene: [BairroScene]
});