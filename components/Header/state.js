import { observable, action } from 'mobx'

class State {
    @observable visible = false

    @action setVisible = visible => this.visible = visible
}

export default new State()