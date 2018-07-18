const Play = require('../play');
const { play, PlayOptions, Region, Event, SendEventOptions } = Play;

cc.Class({
  extends: cc.Component,

  properties: {
    idLabel: {
      type: cc.Label,
      default: null,
    },
    scoreLabel: {
      type: cc.Label,
      default: null,
    },
    resultLabel: {
      type: cc.Label,
      default: null,
    },
  },

  // use this for initialization
  onLoad() {
    const roomName = 'cocos_creator_room';

    const randId = parseInt(Math.random() * 1000000, 10);
    this.idLabel.string = `ID: ${randId}`;

    const opts = new PlayOptions();
    // 设置 APP ID
    opts.appId = '315XFAYyIGPbd98vHPCBnLre-9Nh9j0Va';
    // 设置 APP Key
    opts.appKey = 'Y04sM6TzhMSBmCMkwfI3FpHc';
    // 设置节点区域
    opts.region = Region.EAST_CN;
    play.init(opts);
    // 设置玩家 ID
    play.userId = randId.toString();
    // 注册事件
    play.on(Event.JOINED_LOBBY, () => {
      console.log('on joined lobby');
      play.joinOrCreateRoom(roomName);
    });
    play.on(Event.CREATED_ROOM, () => {
      console.log('on created room');
    });
    play.on(Event.CREATE_ROOM_FAILED, () => {
      console.log('on create room failed');
    });
    play.on(Event.JOINED_ROOM, () => {
      console.log('on joined room');
    });
    play.on(Event.NEW_PLAYER_JOINED_ROOM, newPlayer => {
      console.log(`new player: ${newPlayer.userId}`);
      if (play.player.isMaster()) {
        // 获取房间玩家列表
        const playerList = play.room.playerList;
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
        const options = new SendEventOptions();
        play.sendEvent('win', { winnerId: play.room.masterId }, options);
      }
    });
    play.on(Event.PLAYER_CUSTOM_PROPERTIES_CHANGED, data => {
      const { player } = data;
      const { point } = player.getCustomProperties();
      console.log(`${player.userId}: ${point}`);
      if (player.isLocal()) {
        this.scoreLabel.string = `score:${point}`;
      }
    });
    play.on(Event.CUSTOM_EVENT, event => {
      // 解构事件参数
      const { eventId, eventData } = event;
      if (eventId === 'win') {
        const { winnerId } = eventData;
        console.log(`winnerId: ${winnerId}`);
        // 如果胜利者是自己，则显示胜利 UI；否则显示失败 UI
        if (play.player.actorId === winnerId) {
          this.resultLabel.string = 'win';
        } else {
          this.resultLabel.string = 'lose';
        }
        play.disconnect();
      }
    });
    play.connect();
  },
});
