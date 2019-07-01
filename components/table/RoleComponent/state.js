import { observable, action } from 'mobx'

class State {
    @observable checkedList = []
    @observable checkList = []
    @observable checkAll = false
    @observable indeterminate = true

    @action setCheckedList = (checkedList) => {
        this.checkedList = checkedList
    }

    @action setCheckList = (checkList) => {
        this.checkList = checkList
    }

    @action setIndeterminate = (indeterminate) => {
        this.indeterminate = indeterminate
    }

    @action setCheckAll = (checkAll) => {
        this.checkAll = checkAll
    }
}

export default new State()