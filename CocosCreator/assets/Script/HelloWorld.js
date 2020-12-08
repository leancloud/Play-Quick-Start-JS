let PlaySDK;

if (cc.sys.WECHAT_GAME == cc.sys.platform) {
  PlaySDK = require("./play");
} else {
  PlaySDK = Play;
}

const {
  Client,
  Event,
  ReceiverGroup,
  setAdapters,
  LogLevel,
  setLogger
} = PlaySDK;

const GAME_OVER_EVENT = 100;

cc.Class({
  extends: cc.Component,

  properties: {
    idLabel: {
      type: cc.Label,
      default: null
    },
    scoreLabel: {
      type: cc.Label,
      default: null
    },
    resultLabel: {
      type: cc.Label,
      default: null
    }
  },

  // use this for initialization
  onLoad() {
    const randId = parseInt(Math.random() * 1000000, 10);
    this.idLabel.string = `ID: ${randId}`;

    if (cc.sys.platform === cc.sys.ANDROID) {
      const caPath = cc.url.raw("resources/cacert.pem");
      setAdapters({
        WebSocket: url => new WebSocket(url, "protobuf.1", caPath)
      });
    }

    setLogger({
      [LogLevel.Debug]: console.log.bind(console)
    });

    const play = new Client({
      appId: "g2b0X6OmlNy7e4QqVERbgRJR-gzGzoHsz",
      appKey: "CM91rNV8cPVHKraoFQaopMVT",
      userId: randId.toString(),
      playServer: "https://g2b0x6om.lc-cn-n1-shared.com"
    });

    play.connect().then(() => {
      const now = new Date();
      const hour = now.getHours();
      const minute = now.getMinutes();
      const roomName = `${hour}_${minute}`;
      this.idLabel.string = roomName;
      play.joinOrCreateRoom(roomName).then(() => {
        play.on(Event.PLAYER_ROOM_JOINED, data => {
          const { newPlayer } = data;
          console.log(`new player: ${newPlayer.userId}`);
          if (play.player.isMaster) {
            // 获取房间玩家列表
            const playerList = play.room.playerList;
            for (let i = 0; i < playerList.length; i++) {
              const player = playerList[i];
              // 判断如果是房主，则设置 10 分，否则设置 5 分
              if (player.isMaster) {
                player.setCustomProperties({
                  point: 10
                });
              } else {
                player.setCustomProperties({
                  point: 5
                });
              }
            }
            play.sendEvent(
              GAME_OVER_EVENT,
              { winnerId: play.room.masterId },
              { receiverGroup: ReceiverGroup.All }
            );
          }
        });
        play.on(Event.PLAYER_CUSTOM_PROPERTIES_CHANGED, data => {
          const { player } = data;
          const { point } = player.customProperties;
          console.log(`${player.userId}: ${point}`);
          if (player.isLocal) {
            this.scoreLabel.string = `score:${point}`;
          }
        });
        play.on(Event.CUSTOM_EVENT, event => {
          // 解构事件参数
          const { eventId, eventData } = event;
          if (eventId === GAME_OVER_EVENT) {
            const { winnerId } = eventData;
            console.log(`winnerId: ${winnerId}`);
            // 如果胜利者是自己，则显示胜利 UI；否则显示失败 UI
            if (play.player.actorId === winnerId) {
              this.resultLabel.string = "win";
            } else {
              this.resultLabel.string = "lose";
            }
            play.close();
          }
        });
      });
    });
  }
});
