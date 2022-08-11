export type AccessToken = string & {_type: 'AccessToken'};
export type Homeserver = string & {_type: 'Homeserver'};
export type UserID = string & {_type: 'UserID'}; //admin
export type FullUserID = string & {_type: 'FullUserID'}; //@admin:matrix.server.com
export type DeviceID = string & {_type: 'DeviceID'};