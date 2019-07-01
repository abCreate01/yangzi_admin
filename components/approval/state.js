import { observable, action } from 'mobx'

class state {
    @observable labelName = ''
    @observable jsybName = ''
    @observable upName = ''
    @observable taskId = ''

    @action setLabelName = (labelName) => {
        this.labelName = labelName
    }
    
    @action setJsybName = (jsybName) => {
        this.jsybName = jsybName
    }
    
    @action setUpName = (upName) => {
        this.upName = upName
    }

    @action setTaskId = (taskId) => {
        this.taskId = taskId
    }
}

export default new state()