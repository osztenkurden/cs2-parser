import { EventEmitter } from "events";
import { CMsgSource1LegacyGameEvent_keyT } from "../ts-proto/gameevents";

export class GameEvents extends EventEmitter {

}

export const parseRawEventData = (data: CMsgSource1LegacyGameEvent_keyT) => {
    switch (data.type) {
        case 1:
            return data.valString!;
        case 2:
            return data.valFloat!;
        case 3:
            return data.valLong!;
        case 4:
            return data.valShort!;
        case 5:
            return data.valByte!;
        case 6:
            return data.valBool!;
        case 7:
            return data.valUint64!;
        case 8:
            return data.valLong! | 0;
        case 9:
            return data.valShort! | 0;
    }
}