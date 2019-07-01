import { observable, action, } from 'mobx'

class State {
    @observable currentKey = ''
    @observable first = ''
    @observable second = ''
    @observable third = ''


    @action setCurrentKey = (currentKey) => {
        this.currentKey = currentKey
    }

    @action setFirst = (first) => {
        this.first = first
    }
    @action setSecond = (second) => {
        this.second = second
    }
    @action setThird = (third) => {
        this.third = third
    }


}

export default new State()