import { observable, action } from 'mobx'

class State {
    @observable theme = ''
    @observable menuStyle = ''
    @observable current = ''
    @observable selectedKey = ''
    @observable openKeys = []
    @observable departs = {}


    @action setTheme = (theme) => {
        this.theme = theme
    }
    @action setMenuStyle = (menuStyle) => {
        this.menuStyle = menuStyle
    }
    @action setCurrent = (current) => {
        this.current = current
    }
    @action setSelectedKey = (selectedKey) => {
        this.selectedKey = selectedKey
    }
    @action setOpenKeys = (openKeys) => {
        this.openKeys = openKeys
    }
    @action setDeparts = (departs) => {
        this.departs = departs
    }
   

}

export default new State()