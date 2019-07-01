import { observable, action, computed } from 'mobx'

class State {
    @observable currentKey = 'process'
    @observable currentFirst = ''
    @observable currentSecond = ''
    @observable optionValues = {}
    @observable showTables = []
    @observable userName = ''
    @observable collapsed = false
    @observable isChange = true
    @observable value = {}
    

    @action setCurrentKey = (currentKey) => {
        this.currentKey = currentKey
    }
    @action setOptionValues = (optValues) => {
        this.optionValues = optValues
    }
    @action setShowTables = (showTables) => {
        this.showTables = showTables
    }
    @action setUserName = (userName) => {
        this.userName = userName
    }
    @action setCollapsed = (collapsed) => {
        this.collapsed = collapsed
    }
    @action setCurrentFirst = (currentFirst) => {
        this.currentFirst = currentFirst
    }
    @action setCurrentSecond = (currentSecond) => {
        this.currentSecond = currentSecond
    }
    @action setChange = (isChange) => {
        this.isChange = isChange
    }
    @action setValue = (value) => {
        this.value = value
    }

}

export default new State()