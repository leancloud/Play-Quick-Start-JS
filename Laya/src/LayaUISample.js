var Loader = laya.net.Loader;
var Handler = laya.utils.Handler;
var WebGL = laya.webgl.WebGL;
const { Client, Event, ReceiverGroup, setAdapters, LogLevel, setLogger } = Play;

// 创建TestPageUI的子类
function TestUI()
{
	var Event = laya.events.Event;
	TestUI.super(this);
	//btn是编辑器界面设定的，代码里面能直接使用，并且有代码提示
	this.btn.on(Event.CLICK, this, onBtnClick);
	this.btn2.on(Event.CLICK, this, onBtn2Click);

	function onBtnClick()
	{
		//手动控制组件属性
		this.radio.selectedIndex = 1;
		this.clip.index = 8;
		this.tab.selectedIndex = 2;
		this.combobox.selectedIndex = 0;
		this.check.selected = true;
	}

	function onBtn2Click()
	{
		//通过赋值可以简单快速修改组件属性
		//赋值有两种方式：
		//简单赋值，比如：progress:0.2，就是更改progress组件的value为2
		//复杂复制，可以通知某个属性，比如：label:{color:"#ff0000",text:"Hello LayaAir"}
		this.box.dataSource = {slider: 50, scroll: 80, progress: 0.2, input: "This is a input", label: {color: "#ff0000", text: "Hello LayaAir"}};

		//list赋值，先获得一个数据源数组
		var arr = [];
		for (var i = 0; i < 100; i++) {
			arr.push({label: "item " + i, clip: i % 9});
		}

		//给list赋值更改list的显示
		this.list.array = arr;

		//还可以自定义list渲染方式，可以打开下面注释看一下效果
		//this.list.renderHandler = new Handler(this, onListRender);
	}

	function onListRender(item, index)
	{
		//自定义list的渲染方式
		var label = item.getChildByName("label");
		if (index % 2) {
			label.color = "#ff0000";
		} else {
			label.color = "#000000";
		}
	}
}
Laya.class(TestUI, "TestUI", TestPageUI);

//初始化微信小游戏
Laya.MiniAdpter.init();
//程序入口
Laya.init(600, 400, WebGL);
//激活资源版本控制
Laya.ResourceVersion.enable("version.json", Handler.create(null, beginLoad), Laya.ResourceVersion.FILENAME_VERSION);

function beginLoad(){
	Laya.loader.load("res/atlas/comp.atlas", Handler.create(null, onLoaded));
}

async function onLoaded()
{
	Laya.stage.addChild(new TestUI());

	// Play
	const randId = parseInt(Math.random() * 1000000, 10);
	console.log(`ID: ${randId}`);
    
    setLogger({
      [LogLevel.Debug]: console.log.bind(console),
    });

    const p = new Client({
      // 设置 APP ID
      appId: 'g2b0X6OmlNy7e4QqVERbgRJR-gzGzoHsz',
      // 设置 APP Key
      appKey: 'CM91rNV8cPVHKraoFQaopMVT',
      userId: randId.toString()
    });

    await p.connect();
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const roomName = `${hour}_${minute}`;
    await p.joinOrCreateRoom(roomName);

    p.on(Event.PLAYER_ROOM_JOINED, (data) => {
      const { newPlayer } = data;
      console.log(`new player: ${newPlayer.userId}`);
      if (p.player.isMaster()) {
        // 获取房间玩家列表
        const playerList = p.room.playerList;
        for (let i = 0; i < playerList.length; i++) {
          const player = playerList[i];
          // 判断如果是房主，则设置 10 分，否则设置 5 分
          if (player.isMaster()) {
            player.setCustomProperties({
              point: 10,
            });
          } else {
            player.setCustomProperties({
              point: 5,
            });
          }
        }
        p.sendEvent('win', 
          { winnerId: p.room.masterId }, 
          { receiverGroup: ReceiverGroup.All });
      }
    });
    p.on(Event.PLAYER_CUSTOM_PROPERTIES_CHANGED, (data) => {
      const { player } = data;
      const { point } = player.getCustomProperties();
      console.log(`${player.userId}: ${point}`);
      if (player.isLocal()) {
		    console.log(`score:${point}`);
      }
    });
    p.on(Event.CUSTOM_EVENT, async (event) => {
      // 解构事件参数
      const { eventId, eventData } = event;
      if (eventId === 'win') {
        const { winnerId } = eventData;
        console.log(`winnerId: ${winnerId}`);
        // 如果胜利者是自己，则显示胜利 UI；否则显示失败 UI
        if (p.player.actorId === winnerId) {
			    console.log('win');
        } else {
			    console.log('lose');
        }
        await p.disconnect();
      }
    });
}

