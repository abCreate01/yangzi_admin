const MenuConfig = {
  menus: [
    { key: 'home', title: '首页', icon: 'mobile', route: '/main/home', component: 'Home' },
    {
      key: 'sub1',
      title: '技术月报',
      icon: 'dashboard',
      subs: [
        { key: 'jsybSubmit', title: '技术月报提交', icon: 'mail', route: '/main/jsybSubmit', component: 'JsybSubmit' },
        { key: 'jsybTodo', title: '待办事项', icon: 'mail', route: '/main/jsybToDoList', component: 'JsybTodo' },
      ]
    },
    {
      key: 'sub2',
      title: '系统维护',
      icon: 'safety',
      subs: [
        { key: 'userMng', title: '用户管理', icon: 'mail', route: '/main/userMng', component: 'UserMng' },
        { key: 'roleMng', title: '角色管理', icon: 'mail', route: '/main/roleMng', component: 'RoleMng' },
      ]
    },
  ],

  others: [ // 非菜单相关路由
    { key: 'jsybApproval', route: '/main/jsybToDoList/jsybApproval', component: 'JsybApproval', },
  ],
}

export default MenuConfig
