import { EventEmitter } from "events";

export const eventBus = new EventEmitter(); //방송국 하나 만들기
//이벤트 이름은 도메인.행동으로 만들어야 확장이 쉽다.
