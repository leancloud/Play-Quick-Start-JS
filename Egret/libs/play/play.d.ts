export as namespace Play;

declare class EventEmitter<T> {
  on<K extends keyof T>(event: K, listener: (payload: T[K]) => any): this;

  on(evt: string, listener: Function): this;

  once<K extends keyof T>(event: K, listener: (payload: T[K]) => any): this;

  once(evt: string, listener: Function): this;

  off<K extends keyof T>(evt: K | string, listener?: Function): this;

  emit<K extends keyof T>(evt: K | string, ...args: any[]): boolean;
}

export enum Event {
  /** 连接成功 */
  CONNECTED = 'connected',
  /** 连接失败 */
  CONNECT_FAILED = 'connectFailed',
  /** 断开连接 */
  DISCONNECTED = 'disconnected',
  /** 加入到大厅 */
  LOBBY_JOINED = 'lobbyJoined',
  /** 离开大厅 */
  LOBBY_LEFT = 'lobbyLeft',
  /** 大厅房间列表变化 */
  LOBBY_ROOM_LIST_UPDATED = 'lobbyRoomListUpdate',
  /** 创建房间成功 */
  ROOM_CREATED = 'roomCreated',
  /** 创建房间失败 */
  ROOM_CREATE_FAILED = 'roomCreateFailed',
  /** 加入房间成功 */
  ROOM_JOINED = 'roomJoined',
  /** 加入房间失败 */
  ROOM_JOIN_FAILED = 'roomJoinFailed',
  /** 有新玩家加入房间 */
  PLAYER_ROOM_JOINED = 'newPlayerJoinedRoom',
  /** 有玩家离开房间 */
  PLAYER_ROOM_LEFT = 'playerLeftRoom',
  /** 玩家活跃属性变化 */
  PLAYER_ACTIVITY_CHANGED = 'playerActivityChanged',
  /** 主机变更 */
  MASTER_SWITCHED = 'masterSwitched',
  /** 离开房间 */
  ROOM_LEFT = 'roomLeft',
  /** 被踢出房间 */
  ROOM_KICKED = 'roomKicked',
  /** 房间系统属性变化 */
  ROOM_SYSTEM_PROPERTIES_CHANGED = 'roomSystemPropertiesChanged',
  /** 房间自定义属性变化 */
  ROOM_CUSTOM_PROPERTIES_CHANGED = 'roomCustomPropertiesChanged',
  /** 玩家自定义属性变化 */
  PLAYER_CUSTOM_PROPERTIES_CHANGED = 'playerCustomPropertiesChanged',
  /** 自定义事件 */
  CUSTOM_EVENT = 'customEvent',
  /** 错误事件 */
  ERROR = 'error',
}

export enum ReceiverGroup {
  /** 其他人（除了自己之外的所有人） */
  Others,
  /** 所有人（包括自己） */
  All,
  /** 主机客户端 */
  MasterClient,
}

interface CustomProperties {
  [key: string]: any;
}

interface CustomEventData {
  [key: string]: any;
}

interface ErrorEvent {
  code: number;
  detail: string;
}

declare interface PlayEvent {
  connected: void;
  connectFailed: ErrorEvent;
  disconnected: void;
  lobbyJoined: void;
  lobbyLeft: void;
  lobbyRoomListUpdate: void;
  roomCreated: void;
  roomCreateFailed: ErrorEvent;
  roomJoined: void;
  roomJoinFailed: ErrorEvent;
  newPlayerJoinedRoom: {
    newPlayer: Player;
  };
  playerLeftRoom: {
    leftPlayer: Player;
  };
  playerActivityChanged: {
    player: Player;
  };
  masterSwitched: {
    newMaster: Player;
  };
  roomLeft: void;
  roomKicked: {
    code: number;
    msg: string;
  };
  roomCustomPropertiesChanged: {
    changedProps: CustomProperties;
  };
  roomSystemPropertiesChanged: {
    changedProps: CustomProperties;
  };
  playerCustomPropertiesChanged: {
    player: Player;
    changedProps: CustomProperties;
  };
  customEvent: {
    eventId: number | string;
    eventData: CustomEventData;
    senderId: number;
  };
  error: ErrorEvent;
}

export class LobbyRoom {
  readonly roomName: string;

  readonly maxPlayerCount: number;

  readonly expectedUserIds: string[];

  readonly emptyRoomTtl: number;

  readonly playerTtl: number;

  readonly playerCount: number;

  readonly customRoomPropertiesForLobby: CustomProperties;
}

export class Player {
  readonly userId: string;

  readonly actorId: number;

  readonly isLocal: boolean;

  readonly isMaster: boolean;

  readonly isActive: boolean;

  setCustomProperties(
    properties: CustomProperties,
    opts?: {
      expectedValues?: CustomProperties;
    }
  ): Promise<void>;

  readonly customProperties: CustomProperties;
}

export class Room {
  readonly name: string;

  readonly open: boolean;

  readonly visible: boolean;

  readonly maxPlayerCount: number;

  readonly master: Player;

  readonly masterId: number;

  readonly expectedUserIds: string[];

  readonly playerList: Player[];

  getPlayer(actorId: number): Player;

  setCustomProperties(
    properties: CustomProperties,
    opts?: {
      expectedValues?: CustomProperties;
    }
  ): Promise<void>;

  readonly customProperties: CustomProperties;

  setOpen(open: boolean): Promise<void>;

  setVisible(visible: boolean): Promise<void>;

  setRoomMaxPlayerCount(count: number): Promise<void>;

  setRoomExpectedUserIds(expectedUserIds: string[]): Promise<void>;

  clearRoomExpectedUserIds(): Promise<void>;

  addRoomExpectedUserIds(expectedUserIds: string[]): Promise<void>;

  removeRoomExpectedUserIds(expectedUserIds: string[]): Promise<void>;

  setMaster(newMasterId: number): Promise<void>;

  sendEvent(
    eventId: number,
    eventData?: CustomEventData,
    options?: {
      receiverGroup?: ReceiverGroup;
      targetActorIds?: number[];
    }
  ): Promise<void>;

  kickPlayer(
    actorId: number,
    opts?: {
      code?: number;
      msg?: string;
    }
  ): Promise<void>;

  leave(): Promise<void>;
}

export class Client extends EventEmitter<PlayEvent> {
  readonly room: Room;

  readonly player: Player;

  readonly lobbyRoomList: LobbyRoom[];

  userId: string;

  constructor(opts: {
    appId: string;
    appKey: string;
    userId: string;
    ssl?: boolean;
    feature?: string;
    gameVersion?: string;
    playServer?: string;
  });

  connect(): Promise<Client>;

  reconnect(): Promise<Client>;

  reconnectAndRejoin(): Promise<Room>;

  close(): Promise<void>;

  joinLobby(): Promise<void>;

  leaveLobby(): Promise<void>;

  createRoom(opts?: {
    roomName?: string;
    roomOptions?: Object;
    expectedUserIds?: string[];
  }): Promise<Room>;

  joinRoom(
    roomName: string,
    opts?: {
      expectedUserIds?: string[];
    }
  ): Promise<Room>;

  rejoinRoom(roomName: string): Promise<Room>;

  joinOrCreateRoom(
    roomName: string,
    opts?: {
      roomOptions?: Object;
      expectedUserIds: string[];
    }
  ): Promise<Room>;

  joinRandomRoom(opts?: { matchProperties?: Object }): Promise<Room>;

  matchRandom(
    piggybackPeerId: string,
    opts?: { matchProperties?: Object }
  ): Promise<LobbyRoom>;

  setRoomOpen(open: boolean): Promise<void>;

  setRoomVisible(visible: boolean): Promise<void>;

  setRoomMaxPlayerCount(count: number): Promise<void>;

  setRoomExpectedUserIds(expectedUserIds: string[]): Promise<void>;

  clearRoomExpectedUserIds(): Promise<void>;

  addRoomExpectedUserIds(expectedUserIds: string[]): Promise<void>;

  removeRoomExpectedUserIds(expectedUserIds: string[]): Promise<void>;

  setMaster(newMasterId: number): Promise<void>;

  sendEvent(
    eventId: number,
    eventData?: CustomEventData,
    options?: {
      receiverGroup?: ReceiverGroup;
      targetActorIds?: number[];
    }
  ): Promise<void>;

  leaveRoom(): Promise<void>;

  kickPlayer(
    actorId: number,
    opts?: {
      code?: number;
      msg?: string;
    }
  ): Promise<void>;

  pauseMessageQueue(): void;
  resumeMessageQueue(): void;
}

export enum CreateRoomFlag {
  FixedMaster = 1,
  MasterUpdateRoomProperties = 2,
}

export function setAdapters(newAdapters: { WebSocket: Function }): void;

export enum LogLevel {
  Debug = 'Debug',
  Warn = 'Warn',
  Error = 'Error',
}

export function setLogger(logger: {
  Debug: (...args: any[]) => any;
  Warn: (...args: any[]) => any;
  Error: (...args: any[]) => any;
}): void;

export enum PlayErrorCode {
  OPEN_WEBSOCKET_ERROR = 10001,
  SEND_MESSAGE_STATE_ERROR = 10002,
}
